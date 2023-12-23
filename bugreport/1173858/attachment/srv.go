package main

import (
    "fmt"
    "net/http"
    "log"
)

func HiHandler(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.Write([]byte("Hello, world!\n"))
}

func main() {
    fmt.Printf("I'm listening...\n\n")
    http.HandleFunc("/hi", HiHandler)
    err := http.ListenAndServeTLS(":8443", "srv.crt", "srv.key", nil)
    if err != nil {
        log.Fatal(err)
    }
}

