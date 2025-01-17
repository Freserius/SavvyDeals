// // 
//     // Авторизация
    
//     // Авторизация
// const loginForm = document.getElementById("login-form");
// if (loginForm) {
//     loginForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;

//         try {
//             const response = await fetch("/login", {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 method: "POST",
//                 body: JSON.stringify({ email, password }), // Send credentials as JSON
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 alert(errorData.message);  // Show error message
//                 return;
//             }

//             const result = await response.json();
//             alert(result.message);  // Show success message
//             window.location.href = "/"; // Redirect on successful login
//         } catch (error) {
//             console.error("Ошибка авторизации:", error);
//             alert("Не удалось подключиться к серверу. Попробуйте позже.");
//         }
//     });
// }


//     // Регистрация
//     const registerForm = document.getElementById("register-form");
//     if (registerForm) {
//         registerForm.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             const name = document.getElementById("name").value;
//             const email = document.getElementById("email").value;
//             const password = document.getElementById("password").value;
//             const confirmPassword = document.getElementById("confirm-password").value;

//             if (password !== confirmPassword) {
//                 alert("Пароли не совпадают!");
//                 return;
//             }

//             try {
//                 const response = await fetch("http://127.0.0.1:5000/register", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ name, email, password }),
//                 });

//                 const result = await response.json();
//                 if (response.ok) {
//                     alert(result.message);
//                     window.location.href = "/login";
//                 } else {
//                     alert(result.message);
//                 }
//             } catch (error) {
//                 console.error("Ошибка регистрации:", error);
//             }
//         });
//     }

//     // Обратная связь
//     const feedbackForm = document.getElementById("feedback-form");
//     if (feedbackForm) {
//         feedbackForm.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             const email = document.getElementById("email").value;
//             const message = document.getElementById("message").value;

//             try {
//                 const response = await fetch("/feedback", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ email, message }),
//                 });

//                 const result = await response.json();
//                 if (response.ok) {
//                     alert(result.message);
//                 } else {
//                     alert(result.message);
//                 }
//             } catch (error) {
//                 console.error("Ошибка отправки сообщения:", error);
//             }
//         });
//     }
// ;
document.addEventListener("DOMContentLoaded", () => {
    // Авторизация
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('/login', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    return;
                }

                const result = await response.json();
                alert(result.message);
                window.location.href = "/";
            } catch (error) {
                console.error("Ошибка авторизации:", error);
            }
        });
    }

    // Регистрация
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    return;
                }

                const result = await response.json();
                alert(result.message);
                window.location.href = "/login";
            } catch (error) {
                console.error("Ошибка регистрации:", error);
            }
        });
    }

    // Обратная связь
    const feedbackForm = document.getElementById("feedback-form");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            try {
                const response = await fetch("/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, message }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    return;
                }

                const result = await response.json();
                alert(result.message);
            } catch (error) {
                console.error("Ошибка отправки обратной связи:", error);
            }
        });
    }
});
