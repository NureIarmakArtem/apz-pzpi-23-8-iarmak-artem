package com.example.deliverycourierapp.ui

import android.os.Bundle
import android.view.View
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.deliverycourierapp.R
import com.example.deliverycourierapp.models.StatusUpdateRequest
import com.example.deliverycourierapp.network.RetrofitClient
import com.example.deliverycourierapp.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val courierId = intent.getIntExtra("COURIER_ID", -1)

        val recyclerView = findViewById<RecyclerView>(R.id.recyclerViewOrders)
        val switchStatus = findViewById<Switch>(R.id.switchStatus)

        recyclerView.layoutManager = LinearLayoutManager(this)

        switchStatus.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                switchStatus.text = "Онлайн"
                recyclerView.visibility = View.VISIBLE

                loadOrders(courierId, recyclerView)

                updateCourierStatusOnServer("active")
            } else {
                switchStatus.text = "Офлайн"
                recyclerView.visibility = View.GONE
                updateCourierStatusOnServer("offline")
            }
        }

        switchStatus.isChecked = false
        recyclerView.visibility = View.GONE
    }

    override fun onResume() {
        super.onResume()
        val switchStatus = findViewById<android.widget.Switch>(R.id.switchStatus)
        val recyclerView = findViewById<androidx.recyclerview.widget.RecyclerView>(R.id.recyclerViewOrders)
        val courierId = intent.getIntExtra("COURIER_ID", -1)

        if (switchStatus.isChecked) {
            loadOrders(courierId, recyclerView)
        }
    }

    private fun loadOrders(courierId: Int, rv: RecyclerView) {
        val sessionManager = SessionManager(this)
        val token = "Bearer ${sessionManager.fetchAuthToken()}"

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitClient.api.getMyOrders(token, courierId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        rv.adapter = OrderAdapter(response.body()!!)
                    } else {
                        val errorMsg = if (response.code() == 401) "Сесія застаріла" else "Помилка сервера: ${response.code()}"
                        Toast.makeText(this@DashboardActivity, errorMsg, Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    e.printStackTrace()
                    Toast.makeText(this@DashboardActivity, "Помилка мережі", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun updateCourierStatusOnServer(newStatus: String) {
        val sessionManager = SessionManager(this)
        val token = "Bearer ${sessionManager.fetchAuthToken()}"

        CoroutineScope(Dispatchers.IO).launch {
            try {
                RetrofitClient.api.updateCourierStatus(token, StatusUpdateRequest(newStatus))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}