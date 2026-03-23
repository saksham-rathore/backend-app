class ApiResponse {
    constructor(statuscode, message, data = "success"){
        this.message = message
        this.statuscode = statuscode
        this.data = data
        this.success = statuscode < 400 
    }
}