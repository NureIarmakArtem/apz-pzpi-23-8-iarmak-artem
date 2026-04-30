package main

import (
	"encoding/json"
	"net/http"
)

// API-обробник (Control Plane), що повертає лише метадані
func streamStatusHandler(w http.ResponseWriter, r *http.Request) {
	channelID := r.URL.Query().Get("id")

	// Імітація миттєвої перевірки статусу в Redis
	isLive := channelID == "twitch_main" 

	response := map[string]interface{}{
		"channel_id": channelID,
		"is_live":    isLive,
	}

	// Якщо стрім іде, повертаємо посилання на CDN, а НЕ саме відео
	if isLive {
		response["hls_url"] = "https://edge-cdn.twitch.tv/hls/" + channelID + "/master.m3u8"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

//Запити до ШІ:
//Згенеруй приклад того, як реалізується архітектурне розділення Control Plane та Data Plane на прикладі мови Go, який би демонстрував, як легкий мікросервіс обробляє API-запит і повертає лише метадані та посилання на CDN-маніфест, уникаючи прямої передачі важкого відеопотоку
//Поясни, як архітектурне розділення керуючого трафіку Control Plane та потокових даних Data Plane доповнює стратегію доставки контенту (зокрема використання периферійних мереж на кшталт Twitch Edge CDN та швидкого кешування у Redis) при проєктуванні високонавантажених стрімінгових платформ для уникнення перевантаження рівня бізнес-логіки