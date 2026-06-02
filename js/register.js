const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {

event.preventDefault();

const user = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    middleName: document.getElementById("middleName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birthDate: document.getElementById("birthDate").value,
    password: document.getElementById("password").value,
    role: "customer"
};

try {

    const response = await fetch(
        "http://localhost:3000/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    if(response.ok){
        alert("Регистрация успешна");
        form.reset();
    }

} catch(error){
    console.error(error);
    alert("Ошибка регистрации");
}

});
