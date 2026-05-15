package com.example.deliverycourierapp.models

import com.google.gson.annotations.SerializedName

data class Order(
    val id: Int,
    @SerializedName("courier_id") val courierId: Int?,
    @SerializedName("client_address") val clientAddress: String,
    @SerializedName("delivery_coords") val deliveryCoords: String,
    val status: String,
    @SerializedName("created_at") val createdAt: String
)

data class RouteData(
    val id: Int,
    @SerializedName("order_id") val orderId: Int,
    @SerializedName("path_geometry") val pathGeometry: String,
    @SerializedName("estimated_time") val estimatedTime: Int
)

data class StatusUpdateRequest(
    val status: String,
    val courierLat: Double? = null,
    val courierLon: Double? = null
)