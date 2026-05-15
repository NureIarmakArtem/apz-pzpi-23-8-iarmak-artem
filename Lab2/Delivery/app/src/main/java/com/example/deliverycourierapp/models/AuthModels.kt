package com.example.deliverycourierapp.models

data class LoginRequest(val login: String, val password: String)
data class UserData(val id: Int, val login: String, val role: String, val fullName: String?, val status: String?)
data class LoginResponse(val token: String, val user: UserData)