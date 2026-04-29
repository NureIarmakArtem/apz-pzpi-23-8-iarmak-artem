using System;

namespace TournamentApp
{
    // --- 1. Інтерфейс СТАНУ (State) ---
    public interface IMatchState
    {
        void HandleStart(MatchContext context);
        void HandleEnd(MatchContext context);
    }

    // --- 2. КОНКРЕТНІ СТАНИ (Concrete Products/States) ---

    // Стан: Очікування гравців
    public class WaitingState : IMatchState
    {
        public void HandleStart(MatchContext context)
        {
            Console.WriteLine("[Waiting] Всі гравці готові. Починаємо матч...");
            context.TransitionTo(new InProgressState());
        }

        public void HandleEnd(MatchContext context)
        {
            Console.WriteLine("[Error] Неможливо завершити матч, що не розпочався.");
        }
    }

    // Стан: Матч триває
    public class InProgressState : IMatchState
    {
        public void HandleStart(MatchContext context)
        {
            Console.WriteLine("[Error] Матч уже запущений і триває.");
        }

        public void HandleEnd(MatchContext context)
        {
            Console.WriteLine("[InProgress] Матч завершено. Система фіксує результати...");
            context.TransitionTo(new FinishedState());
        }
    }

    // Стан: Матч завершено
    public class FinishedState : IMatchState
    {
        public void HandleStart(MatchContext context)
        {
            Console.WriteLine("[Error] Неможливо розпочати завершений матч. Створіть нове лобі.");
        }

        public void HandleEnd(MatchContext context)
        {
            Console.WriteLine("[Error] Матч уже знаходиться в архіві.");
        }
    }

    // --- 3. КОНТЕКСТ (Context/Creator) ---
    public class MatchContext
    {
        private IMatchState _state;

        public MatchContext(IMatchState initialState)
        {
            TransitionTo(initialState);
        }

        // Метод для зміни стану
        public void TransitionTo(IMatchState state)
        {
            _state = state;
            Console.WriteLine($"---> Система: Перехід до стану {state.GetType().Name}.");
        }

        // Клієнтські методи, що делегують роботу стану
        public void Start() => _state.HandleStart(this);
        public void End() => _state.HandleEnd(this);
    }

    // --- 4. КЛІЄНТСЬКИЙ КОД (Client) ---
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            // Створюємо матч у початковому стані очікування
            var match = new MatchContext(new WaitingState());

            // 1. Пробуємо завершити (буде помилка логіки стану)
            match.End();

            // 2. Стартуємо матч (перехід до InProgress)
            match.Start();

            // 3. Пробуємо стартувати ще раз (помилка)
            match.Start();

            // 4. Завершуємо матч (перехід до Finished)
            match.End();

            // 5. Спроба маніпуляцій після завершення
            match.Start();

            Console.ReadLine();
        }
    }
}

/* 
Запит до ШІ (Gemini 3.1 Pro):
Реалізуй патерн Стан (State) мовою C# (наприклад: зміна станів матчу Очікування, У процесі, Завершено).
Спочатку коротко опиши проблему.
Реалізуй рішення з використанням State, включаючи:
інтерфейс або абстрактний клас State;
кілька ConcreteState, які реалізують логіку конкретних станів;
клас Context, який зберігає посилання на поточний стан та делегує йому виконання дій;
механізм переходу між станами всередині класів.
*/

