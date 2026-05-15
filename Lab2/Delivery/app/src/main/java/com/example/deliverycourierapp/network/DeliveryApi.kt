package com.example.deliverycourierapp.network

import com.example.deliverycourierapp.models.LoginRequest
import com.example.deliverycourierapp.models.LoginResponse
import com.example.deliverycourierapp.models.Order
import com.example.deliverycourierapp.models.StatusUpdateRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Header
import retrofit2.http.PATCH

interface DeliveryApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("orders/my")
    suspend fun getMyOrders(
        @Header("Authorization") token: String,
        @Query("courierId") courierId: Int
    ): Response<List<Order>>

    @PATCH("orders/{id}/status")
    suspend fun updateOrderStatus(
        @Header("Authorization") token: String,
        @Path("id") orderId: Int,
        @Body request: StatusUpdateRequest
    ): Response<Any>

    @PATCH("couriers/status")
    suspend fun updateCourierStatus(
        @Header("Authorization") token: String,
        @Body request: StatusUpdateRequest
    ): Response<Any>
}

