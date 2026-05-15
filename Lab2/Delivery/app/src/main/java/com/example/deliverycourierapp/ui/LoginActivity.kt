package com.example.deliverycourierapp.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.deliverycourierapp.R
import com.example.deliverycourierapp.models.LoginRequest
import com.example.deliverycourierapp.network.RetrofitClient
import com.example.deliverycourierapp.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)

        val etLogin = findViewById<EditText>(R.id.etLogin)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val login = etLogin.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (login.isNotEmpty() && password.isNotEmpty()) {
                performLogin(login, password)
            } else {
                Toast.makeText(this, "Введіть логін та пароль", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun performLogin(login: String, pass: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitClient.api.login(LoginRequest(login, pass))
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        sessionManager.saveAuthToken(response.body()!!.token)
                        Toast.makeText(this@LoginActivity, "Успішно!", Toast.LENGTH_SHORT).show()

                        val intent = Intent(this@LoginActivity, DashboardActivity::class.java)

                        intent.putExtra("COURIER_ID", response.body()!!.user.id)
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Помилка логіну", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@LoginActivity, "Помилка мережі: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}