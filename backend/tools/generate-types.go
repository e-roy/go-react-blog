package main

import (
	"flag"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"log"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

// TypeInfo represents a Go type that will be converted to TypeScript
type TypeInfo struct {
	Name       string
	Fields     []FieldInfo
	IsResponse bool
	Comment    string
}

// FieldInfo represents a field in a Go struct
type FieldInfo struct {
	Name     string
	Type     string
	JSONTag  string
	Required bool
	Comment  string
}

// TypeMapping maps Go types to TypeScript types
var TypeMapping = map[string]string{
	"int":           "number",
	"int64":         "number",
	"float64":       "number",
	"string":        "string",
	"bool":          "boolean",
	"time.Time":     "string",
	"uuid.UUID":     "string",
	"[]string":      "string[]",
	"[]int":         "number[]",
	"[]Blog":        "Blog[]",
}

// TypeScript template for generating interfaces
const tsTemplate = `// Auto-generated TypeScript types from Go backend
// Generated on: {{.Timestamp}}
// Do not edit manually - regenerate with: go run tools/generate-types.go

{{range .Types}}
{{if .Comment}}// {{.Comment}}{{end}}
export interface {{.Name}} {
{{range .Fields}}  {{.Name}}: {{.Type}};{{if .Comment}} // {{.Comment}}{{end}}
{{end}}}

{{end}}
`

func main() {
	var outputDir string
	flag.StringVar(&outputDir, "output", "../frontend/app/types", "Output directory for generated types")
	flag.Parse()

	// Parse Go files in the models directory
	types, err := parseModels("models")
	if err != nil {
		log.Fatalf("Failed to parse models: %v", err)
	}

	// Generate TypeScript file
	if err := generateTypeScript(types, outputDir); err != nil {
		log.Fatalf("Failed to generate TypeScript: %v", err)
	}

	fmt.Printf("Successfully generated types for %d structs\n", len(types))
}

func parseModels(dir string) ([]TypeInfo, error) {
	var types []TypeInfo

	// Walk through the models directory
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() || !strings.HasSuffix(path, ".go") {
			return nil
		}

		// Parse Go file
		fset := token.NewFileSet()
		node, err := parser.ParseFile(fset, path, nil, parser.ParseComments)
		if err != nil {
			return fmt.Errorf("failed to parse %s: %v", path, err)
		}

		// Extract types from the file
		fileTypes := extractTypes(node)
		types = append(types, fileTypes...)

		return nil
	})

	return types, err
}

func extractTypes(node *ast.File) []TypeInfo {
	var types []TypeInfo

	// Look for type declarations
	for _, decl := range node.Decls {
		if genDecl, ok := decl.(*ast.GenDecl); ok {
			for _, spec := range genDecl.Specs {
				if typeSpec, ok := spec.(*ast.TypeSpec); ok {
					if structType, ok := typeSpec.Type.(*ast.StructType); ok {
						typeInfo := TypeInfo{
							Name:    typeSpec.Name.Name,
							Comment: extractComment(genDecl.Doc),
						}

						// Check if this is a response type
						typeInfo.IsResponse = strings.HasSuffix(typeInfo.Name, "Response")

						// Extract fields
						for _, field := range structType.Fields.List {
							if len(field.Names) > 0 {
								// Use JSON tag if available, otherwise use camelCase of Go field name
								fieldName := field.Names[0].Name
								if field.Tag != nil {
									tag := strings.Trim(field.Tag.Value, "`")
									if strings.Contains(tag, "json:") {
										jsonTag := extractJSONTag(tag)
										if jsonTag != "" {
											fieldName = jsonTag
										}
									}
								}

								fieldInfo := FieldInfo{
									Name:    fieldName, // Use the actual JSON tag name
									Type:    convertGoTypeToTS(field.Type),
									Comment: extractComment(field.Doc),
								}

								// Extract JSON tag
								if field.Tag != nil {
									tag := strings.Trim(field.Tag.Value, "`")
									if strings.Contains(tag, "json:") {
										jsonTag := extractJSONTag(tag)
										fieldInfo.JSONTag = jsonTag
										// Check if field is required (no omitempty)
										fieldInfo.Required = !strings.Contains(tag, "omitempty")
									}
								}

								typeInfo.Fields = append(typeInfo.Fields, fieldInfo)
							}
						}

						types = append(types, typeInfo)
					}
				}
			}
		}
	}

	return types
}

func convertGoTypeToTS(expr ast.Expr) string {
	switch t := expr.(type) {
	case *ast.Ident:
		if tsType, ok := TypeMapping[t.Name]; ok {
			return tsType
		}
		return t.Name
	case *ast.StarExpr:
		return convertGoTypeToTS(t.X) + " | null"
	case *ast.ArrayType:
		elementType := convertGoTypeToTS(t.Elt)
		return elementType + "[]"
	case *ast.SelectorExpr:
		if ident, ok := t.X.(*ast.Ident); ok {
			fullType := ident.Name + "." + t.Sel.Name
			if tsType, ok := TypeMapping[fullType]; ok {
				return tsType
			}
			return fullType
		}
		return "any"
	case *ast.InterfaceType:
		return "any"
	default:
		return "any"
	}
}

func extractComment(group *ast.CommentGroup) string {
	if group == nil {
		return ""
	}
	return strings.TrimSpace(group.Text())
}

func extractJSONTag(tag string) string {
	// Simple JSON tag extraction - could be enhanced
	if strings.Contains(tag, "json:") {
		parts := strings.Split(tag, " ")
		for _, part := range parts {
			if strings.HasPrefix(part, "json:") {
				jsonValue := strings.TrimPrefix(part, "json:")
				jsonValue = strings.Trim(jsonValue, `"`)
				// Remove omitempty if present
				jsonValue = strings.Split(jsonValue, ",")[0]
				return jsonValue
			}
		}
	}
	return ""
}

func toCamelCase(s string) string {
	parts := strings.Split(s, "_")
	for i, part := range parts {
		if i > 0 && len(part) > 0 {
			parts[i] = strings.ToUpper(part[:1]) + strings.ToLower(part[1:])
		} else if len(part) > 0 {
			parts[i] = strings.ToLower(part)
		}
	}
	return strings.Join(parts, "")
}

func generateTypeScript(types []TypeInfo, outputDir string) error {
	// Create output directory if it doesn't exist
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("failed to create output directory: %v", err)
	}

	// Filter to only include Response types and main entities
	var filteredTypes []TypeInfo
	for _, t := range types {
		if t.IsResponse || t.Name == "Blog" || 
		   t.Name == "CreateBlogRequest" ||
		   t.Name == "UpdateBlogRequest" {
			filteredTypes = append(filteredTypes, t)
		}
	}

	// Prepare template data
	data := struct {
		Types     []TypeInfo
		Timestamp string
	}{
		Types:     filteredTypes,
		Timestamp: "2025-08-31", // You could make this dynamic
	}

	// Parse and execute template
	tmpl, err := template.New("typescript").Parse(tsTemplate)
	if err != nil {
		return fmt.Errorf("failed to parse template: %v", err)
	}

	// Create output file
	outputFile := filepath.Join(outputDir, "generated.ts")
	file, err := os.Create(outputFile)
	if err != nil {
		return fmt.Errorf("failed to create output file: %v", err)
	}
	defer file.Close()

	// Execute template
	if err := tmpl.Execute(file, data); err != nil {
		return fmt.Errorf("failed to execute template: %v", err)
	}

	fmt.Printf("Generated types in: %s\n", outputFile)
	return nil
}
