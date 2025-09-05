# Getting Started with Go: A Comprehensive Guide

Go (or Golang) is a modern programming language designed by Google. It's known for its simplicity, efficiency, and excellent support for concurrent programming. This guide will take you from basic syntax to intermediate concepts used in real-world applications.

## Why Go?

- **Simple Syntax**: Clean, readable code with minimal keywords
- **Fast Compilation**: Quick build times even for large projects
- **Built-in Concurrency**: Goroutines and channels for parallel processing
- **Garbage Collection**: Automatic memory management
- **Cross-platform**: Compile once, run anywhere
- **Static Typing**: Catch errors at compile time
- **Rich Standard Library**: Everything you need for web development

## Basic Syntax and Concepts

### Hello World

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

**Key Points:**

- `package main` - Entry point for executable programs
- `import "fmt"` - Import the formatting package
- `func main()` - Program entry point
- `fmt.Println()` - Print with newline

### Variables and Constants

```go
package main

import "fmt"

func main() {
    // Variable declarations
    var name string = "Go"
    var age int = 25

    // Short variable declaration (most common)
    language := "Golang"
    year := 2009

    // Multiple variables
    var (
        firstName = "John"
        lastName  = "Doe"
        email     = "john@example.com"
    )

    // Constants
    const pi = 3.14159
    const (
        statusOK = 200
        statusNotFound = 404
    )

    fmt.Println(name, age, language, year)
    fmt.Println(firstName, lastName, email)
    fmt.Println(pi, statusOK)
}
```

### Data Types

```go
package main

import "fmt"

func main() {
    // Basic types
    var (
        // Integers
        age     int   = 25
        count   int8  = 100
        bigNum  int64 = 9223372036854775807

        // Floats
        price    float32 = 19.99
        balance  float64 = 1234.5678

        // Strings
        name     string = "Go Developer"
        message  string = `This is a
        multi-line string`

        // Booleans
        isActive bool = true
        isDone   bool = false

        // Arrays (fixed size)
        scores [5]int = [5]int{90, 85, 78, 92, 88}

        // Slices (dynamic arrays)
        fruits []string = []string{"apple", "banana", "orange"}

        // Maps (key-value pairs)
        ages map[string]int = map[string]int{
            "Alice": 25,
            "Bob":   30,
            "Carol": 28,
        }
    )

    fmt.Printf("Age: %d, Price: %.2f, Name: %s\n", age, price, name)
    fmt.Printf("Scores: %v\n", scores)
    fmt.Printf("Fruits: %v\n", fruits)
    fmt.Printf("Ages: %v\n", ages)
}
```

### Functions

```go
package main

import "fmt"

// Basic function
func add(a, b int) int {
    return a + b
}

// Multiple return values
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// Named return values
func calculate(x, y int) (sum, product int) {
    sum = x + y
    product = x * y
    return // naked return
}

// Variadic function (variable number of arguments)
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

// Function as parameter
func applyOperation(a, b int, operation func(int, int) int) int {
    return operation(a, b)
}

func main() {
    // Basic function call
    result := add(5, 3)
    fmt.Println("5 + 3 =", result)

    // Multiple return values
    quotient, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("10 / 2 =", quotient)
    }

    // Named return values
    s, p := calculate(4, 5)
    fmt.Printf("Sum: %d, Product: %d\n", s, p)

    // Variadic function
    total := sum(1, 2, 3, 4, 5)
    fmt.Println("Sum of 1,2,3,4,5 =", total)

    // Function as parameter
    multiply := func(x, y int) int { return x * y }
    result = applyOperation(6, 7, multiply)
    fmt.Println("6 * 7 =", result)
}
```

### Structs and Methods

```go
package main

import "fmt"

// Define a struct
type Person struct {
    Name    string
    Age     int
    Email   string
    Address Address
}

type Address struct {
    Street string
    City   string
    State  string
    Zip    string
}

// Method on Person struct
func (p Person) GetFullInfo() string {
    return fmt.Sprintf("%s (%d) - %s", p.Name, p.Age, p.Email)
}

// Method with pointer receiver (can modify the struct)
func (p *Person) SetAge(age int) {
    p.Age = age
}

// Method on Address struct
func (a Address) GetFullAddress() string {
    return fmt.Sprintf("%s, %s, %s %s", a.Street, a.City, a.State, a.Zip)
}

func main() {
    // Create struct instances
    person := Person{
        Name:  "John Doe",
        Age:   30,
        Email: "john@example.com",
        Address: Address{
            Street: "123 Main St",
            City:   "Anytown",
            State:  "CA",
            Zip:    "12345",
        },
    }

    // Access fields
    fmt.Println("Name:", person.Name)
    fmt.Println("Age:", person.Age)

    // Call methods
    fmt.Println(person.GetFullInfo())
    fmt.Println("Address:", person.Address.GetFullAddress())

    // Modify using pointer receiver
    person.SetAge(31)
    fmt.Println("Updated age:", person.Age)

    // Anonymous struct
    employee := struct {
        ID       int
        Position string
        Salary   float64
    }{
        ID:       1001,
        Position: "Developer",
        Salary:   75000.0,
    }

    fmt.Printf("Employee: %+v\n", employee)
}
```

### Interfaces

```go
package main

import "fmt"

// Define an interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Implement interface with Rectangle
type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Implement interface with Circle
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return 3.14159 * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * 3.14159 * c.Radius
}

// Function that works with any Shape
func printShapeInfo(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}

func main() {
    rect := Rectangle{Width: 10, Height: 5}
    circle := Circle{Radius: 7}

    // Both implement Shape interface
    printShapeInfo(rect)
    printShapeInfo(circle)

    // Interface can hold any implementing type
    var shape Shape
    shape = rect
    fmt.Println("Rectangle area:", shape.Area())

    shape = circle
    fmt.Println("Circle area:", shape.Area())
}
```

### Error Handling

```go
package main

import (
    "errors"
    "fmt"
    "strconv"
)

// Custom error type
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation error in %s: %s", e.Field, e.Message)
}

// Function that returns an error
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Function with custom error
func validateAge(age int) error {
    if age < 0 {
        return ValidationError{
            Field:   "age",
            Message: "age cannot be negative",
        }
    }
    if age > 150 {
        return ValidationError{
            Field:   "age",
            Message: "age seems unrealistic",
        }
    }
    return nil
}

// Function that might fail
func parseNumber(s string) (int, error) {
    num, err := strconv.Atoi(s)
    if err != nil {
        return 0, fmt.Errorf("failed to parse '%s' as number: %w", s, err)
    }
    return num, nil
}

func main() {
    // Basic error handling
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }

    // Try division by zero
    result, err = divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    }

    // Custom error handling
    err = validateAge(25)
    if err != nil {
        fmt.Println("Validation error:", err)
    }

    err = validateAge(-5)
    if err != nil {
        fmt.Println("Validation error:", err)
    }

    // Error wrapping
    num, err := parseNumber("abc")
    if err != nil {
        fmt.Println("Parse error:", err)
    } else {
        fmt.Println("Parsed number:", num)
    }
}
```

### Goroutines and Channels

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// Basic goroutine
func sayHello(name string) {
    for i := 0; i < 3; i++ {
        fmt.Printf("Hello %s! (%d)\n", name, i+1)
        time.Sleep(100 * time.Millisecond)
    }
}

// Channel communication
func sendNumbers(ch chan int) {
    for i := 1; i <= 5; i++ {
        ch <- i
        time.Sleep(100 * time.Millisecond)
    }
    close(ch)
}

// Worker pool pattern
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job)
        time.Sleep(500 * time.Millisecond)
        results <- job * 2
    }
}

func main() {
    // Basic goroutines
    fmt.Println("=== Basic Goroutines ===")
    go sayHello("Alice")
    go sayHello("Bob")
    time.Sleep(1 * time.Second)

    // Channels
    fmt.Println("\n=== Channels ===")
    ch := make(chan int)
    go sendNumbers(ch)

    for num := range ch {
        fmt.Printf("Received: %d\n", num)
    }

    // Worker pool
    fmt.Println("\n=== Worker Pool ===")
    jobs := make(chan int, 10)
    results := make(chan int, 10)

    // Start workers
    var wg sync.WaitGroup
    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            worker(id, jobs, results)
        }(i)
    }

    // Send jobs
    go func() {
        for i := 1; i <= 9; i++ {
            jobs <- i
        }
        close(jobs)
    }()

    // Close results when workers are done
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    for result := range results {
        fmt.Printf("Result: %d\n", result)
    }
}
```

### Packages and Modules

```go
// go.mod file
module myapp

go 1.21

require (
    github.com/gorilla/mux v1.8.0
)

// main.go
package main

import (
    "fmt"
    "myapp/utils"  // Local package
    "myapp/models" // Local package
)

func main() {
    // Use local package
    result := utils.Add(5, 3)
    fmt.Println("Result:", result)

    // Use models
    user := models.NewUser("John", "john@example.com")
    fmt.Println("User:", user.GetInfo())
}

// utils/math.go
package utils

func Add(a, b int) int {
    return a + b
}

func Multiply(a, b int) int {
    return a * b
}

// models/user.go
package models

type User struct {
    Name  string
    Email string
}

func NewUser(name, email string) *User {
    return &User{
        Name:  name,
        Email: email,
    }
}

func (u *User) GetInfo() string {
    return fmt.Sprintf("%s (%s)", u.Name, u.Email)
}
```

## Getting Started

1. **Install Go**: Download from [golang.org](https://golang.org)
2. **Verify Installation**: Run `go version`
3. **Set up workspace**: Create a project directory
4. **Initialize module**: Run `go mod init your-project-name`
5. **Create your first program**: Write a simple "Hello World"
6. **Run it**: Use `go run main.go`

## Common Go Commands

```bash
# Initialize a new module
go mod init project-name

# Run a program
go run main.go

# Build an executable
go build

# Install dependencies
go mod tidy

# Run tests
go test ./...

# Format code
go fmt ./...

# Check for issues
go vet ./...
```

Go is an excellent choice for backend development, especially for web services, APIs, and microservices. Its simplicity and performance make it ideal for both learning and production use!
