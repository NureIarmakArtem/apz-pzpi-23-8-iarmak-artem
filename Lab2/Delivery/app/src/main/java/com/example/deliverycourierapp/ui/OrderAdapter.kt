package com.example.deliverycourierapp.ui

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.deliverycourierapp.R
import com.example.deliverycourierapp.models.Order

class OrderAdapter(private val orders: List<Order>) : RecyclerView.Adapter<OrderAdapter.OrderViewHolder>() {

    class OrderViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvAddress: TextView = view.findViewById(R.id.tvOrderAddress)
        val tvStatus: TextView = view.findViewById(R.id.tvOrderStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_order, parent, false)
        return OrderViewHolder(view)
    }

    override fun onBindViewHolder(holder: OrderViewHolder, position: Int) {
        val currentOrder = orders[position]

        holder.tvAddress.text = "Адреса: ${currentOrder.clientAddress}"
        holder.tvStatus.text = "Статус: ${currentOrder.status}"

        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, OrderDetailsActivity::class.java).apply {
                putExtra("ORDER_ID", currentOrder.id)
                putExtra("ADDRESS", currentOrder.clientAddress)
                putExtra("STATUS", currentOrder.status)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = orders.size
}