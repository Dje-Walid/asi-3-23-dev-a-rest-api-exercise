# asi-3-23-dev-a-rest-api-exercise
Link to my repo : https://github.com/Dje-Walid/asi-3-23-dev-a-rest-api-exercise

Specs : https://github.com/nine1000school/asi-3-23-dev-rest-api-exercise/blob/main/README.md

# SETUP THE PROJECT
- Copy the **.env.dist** and rename it **.env**
- Fill it with your custom **database info**
- Also fill it with your custom **JWT SECRET**
- run npx knex seed:run to create the first user and roles (email: admin@admin.fr password: superAdmin)

# Soucis rencontré
Pour une raison que j'ignore il m'est impossible de récupérer le header et de donc faire fonctionner les vérifications de permissions et le JWT.
Cependant pour tout de même faire la partie permissions j'ai ajouté l'option "**hasRight**" dans plusieurs appels api afin que vous puissiez tout de même tester avec ou sans les permissions

NB: Par défaut **hasRight** est à **true**