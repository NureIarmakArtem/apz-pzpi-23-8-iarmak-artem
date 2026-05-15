package com.example.deliverycourierapp.ui

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.deliverycourierapp.R
import com.example.deliverycourierapp.models.StatusUpdateRequest
import com.example.deliverycourierapp.network.RetrofitClient
import com.example.deliverycourierapp.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class OrderDetailsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_details)

        val orderId = intent.getIntExtra("ORDER_ID", -1)
        val address = intent.getStringExtra("ADDRESS")
        val status = intent.getStringExtra("STATUS")

        findViewById<TextView>(R.id.tvOrderId).text = "Замовлення №$orderId"
        findViewById<TextView>(R.id.tvOrderAddress).text = "Адреса: $address"
        findViewById<TextView>(R.id.tvOrderStatus).text = "Статус: $status"

        val btnComplete = findViewById<Button>(R.id.btnComplete)

        btnComplete.setOnClickListener {
            if (orderId != -1) {
                btnComplete.isEnabled = false
                completeOrderOnServer(orderId)
            }
        }
    }

    private fun completeOrderOnServer(orderId: Int) {
        val sessionManager = SessionManager(this)
        val token = "Bearer ${sessionManager.fetchAuthToken()}"

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = StatusUpdateRequest(
                    status = "completed",
                    courierLat = 50.00,
                    courierLon = 36.23
                )
                val response = RetrofitClient.api.updateOrderStatus(token, orderId, request)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@OrderDetailsActivity, "Доставлено!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(
                            this@OrderDetailsActivity,
                            "Помилка: ${response.code()} - ${response.errorBody()?.string()}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    e.printStackTrace()
                    Toast.makeText(this@OrderDetailsActivity, "Помилка мережі", Toast.LENGTH_SHORT).show()
                    findViewById<Button>(R.id.btnComplete).isEnabled = true
                }
            }
        }
    }
}