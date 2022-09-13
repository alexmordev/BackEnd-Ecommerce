## Ecommerce con Node

## Temas
1. Instalacion y configuración
2. Instalacion de contenedores con Docker.
3. Configuración de PG-Admin.
4. Crud con Sequelize.
5. Migraciones Sequelie.
6. Modificación de Tablas Sequelize.
7. Relaciones Sequelize.
8. Como corregir un error al levantar una relación uno a uno.
9. Relacion uno a uno belongTo
10. Relación uno a uno de ambos lados HasOne (bidireccional).
11. Eliminar el objeto incómodo. Limpiar datos de respuesta tras un vínculo (enviar arreglo unidimencional).
12. Automatiza tu creación de usuarios.
13. hasMany relaciones uno a muchos.
14. belongsToMany relaciones muchos a muchos (configuracion).
15. Resolver Asociaciones anidadas.
16. Asociaciones Multiples.
17. belongsToMany relaciones muchos a muchos (Resolucion).
18. Calcular total de columnas.(no lo hagas con una cantidad mayor a 100 campos)
19. Paginacion con limit y offset
20. Agrega un filtro de precio.
21. Agrega un filtro por rango  de precio.
22. Deploy en Heroku

## Teconologias
1. Node https://node-postgres.com/
2. ExpressJS http://expressjs.com/es/4x/api.html
3. Nodemon https://github.com/remy/nodemon
4. Dotenv https://github.com/motdotla/dotenv
5. Cors. https://github.com/expressjs/cors
6. Docker. https://hub.docker.com/
7. PG-Admin. https://www.pgadmin.org/
8. Sequelize. https://sequelize.org/
9. boom. https://github.com/hapijs/boom
10. joi. https://joi.dev/api/
11. Heroku. https://dashboard.heroku.com/



## Instalación incial
1. Clona el repo git@github.com:platzi/curso-nodejs-postgres.git
2. Desde dentro de la carpeta instalar los paquetes por defecto, más dotenv.
    ~~~
        npm install
        npm dotenv
    ~~~
3.  Crea la carpeta Config y dentro config.js
    ~~~
        require('dotenv').config();

        const config = {
            port: process.env.PORT || 3030
        }
        module.exports = {config};
    ~~~
4. Crea el archivo .env en la raíz
    ~~~
        PORT = 3030
    ~~~
## Instalación de Imágenes con Docker
1. Agregar docker-compose.yml a la raíz del repo. Crear un par de servicios, uno para PostgreSQL y otro para PG-Admin (ten particular cuidado con los espacios, de la forma en que los guardes deberas ingresar tus datos de acceso)
    ~~~
        version: '3.3'
        services:
            postgres:
                image: postgres:13
                environment:
                - POSTGRES_DB=my_store
                - POSTGRES_USER=rtp_access
                - POSTGRES_PASSWORD=rtp_password
                ports:
                - 5432:5432
                volumes:
                - /data/postgres_data:/var/lib/postgresql/data
            
            pgadmin:
                image: dpage/pgadmin4
                environment:
                - PGADMIN_DEFAULT_EMAIL=alexmorjim@hotmail.com
                - PGADMIN_DEFAULT_PASSWORD=rtp_password
                ports:
                - 7070:80
    ~~~
2. Crear la carpeta data en el root y dentro postgres_data para la persistencia de datos.
3. Agregar docker-compose.yml, node_modules y .env a .gitignore que debe añadirse en la raíz
    ~~~
        //directories
        node_modules/ 

        //DB    
        postgres_data

        //docker
        docker-compose.yml

        //dote
        .env
    ~~~
4. Levanta tu contenedor con 
    ~~~
        docker-compose up -d 
    ~~~
    Acá puedes elegir levantar por seaparado cada servicio dentro de docker o todo junto
    ~~~
        1. docker-compose up -d postgres
        2. docker-compose up -d pgadmin
    ~~~
## Configuración de PG-ADMIN
5. Configura pgAdmin
    1. accede con los datos que definiste
        <img src="utils/images/accessPG.png"/>
    2. abre el cuadro para registrar un nuevo server
        <img src="utils/images/registrar_server_pg.png"/>
    3. nombrar un nuevo server
        <img src="utils/images/nombrarServer.png"/>
    4. Para obtener la ip deberas correr
        ~~~
            docker ps 
            docker inspect "hash_ID"
        ~~~
    5. Registra  el nuevo server.
        <img src="utils/images/completar_datos_acceso.png"/> 
## CRUD con Sequelize
1. Crea las variables de entorno restantes <b>TAMBIÉN DENTRO DE .env<b>
    ~~~
        require('dotenv').config();

        const config = {
            env: process.env.NODE_ENV || 'dev',
            port: process.env.PORT || 3030,
            dbUser: process.env.DB_USER,
            dbPassword: process.env.DB_PASSWORD,
            dbHost: process.env.DB_HOST,
            dbName: process.env.DB_NAME,
            dbPort: process.env.DB_PORT
        }
        module.exports = {config};
    ~~~
2. Instalar dependencias.
    ~~~
        npm install --save sequelize

        # One of the following:
        npm install --save pg pg-hstore # Postgres
        npm install --save mysql2
        npm install --save mariadb
        npm install --save sqlite3
        npm install --save tedious # Microsoft SQL Server
    ~~~
3. Configurar sequelize en libs
   ~~~
    const { Sequelize } = require('sequelize');
    const {config} = require('../config/config');

    const USER = encodeURIComponent( config.dbUser );
    const PASSWORD = encodeURIComponent( config.dbPassword );
    const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

    const sequelize =  new Sequelize( URL, {
        dialect: 'postgres',
        logging: true, //mostrar la traducción de las peticioes hechas
    } )

    module.exports = sequelize;
   ~~~
4. Crea la tabla "models" dentro crea user.model.js
    ~~~
        const { Model, DataTypes, Sequelize } = require('sequelize');

        const USER_TABLE = 'users'; //definir nombre tabla;
        const UserSchema = {
            id:{
                allowNull:false, //no puede ser falso
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            password:{
                allowNull: false,
                type: DataTypes.STRING
            },
            createdAt:{
                allowNull: false,
                type: DataTypes.DATE,
                field: 'created_at',
                defaultValue: Sequelize.NOW
            }
        }
        class User extends Model{
            static associciate(){
                //assocciate
            }
            static config(sequelize){
                return{
                    sequelize,
                    tableName: USER_TABLE,
                    modelName: 'User',
                    timestamps: false 
                }
            }
        }
        module.exports= {USER_TABLE,UserSchema,User };
    ~~~
5. Crea dentro de models el archivo index.js donde llamaras a todos tus modelos
    ~~~
        const { User, UserSchema } = require('./user.model');

        function setupModels(sequelize){
            User.init(UserSchema, User.config( sequelize ));
        }

        module.exports= setupModels;
    ~~~
6. Crea una consulta en uno de tus servicios, trae los modelos directamente de donde definiste los valores de incio de sequelize
    ~~~
        const {models} = require('../libs/sequelize');

        class UserService {
            constructor() {
            }
            async find() {
                const res = await models.User.findAll();
                return res;
            }
        }
    ~~~
7. Vuelve a user.models y agrega estas dos lineas
    ~~~
        setupModels(sequelize); // este agrega los modelos creados
        sequelize.sync(); // Este sincroniza los cambios hechos
    ~~~
8. Haz una consulta debería devolverte un arreglo vacio.
9.  Modifica el resto de servicios
    ~~~
    class UserService {
        constructor() {}

        async create(data) {
            // console.log("AQUI!!", Sequelize);
            const newUser =  await models.User.create( data) //crear
            return newUser;
        }

        async find() {
            const res = await models.User.findAll();
            return res;
        }

        async findOne(id) {
            const res  =  await models.User.findByPk(id);// buscar con id
            if(!res){
            boom.notFound('User Not Found');
            }
            return res;
        }

        async update(id, changes) {
            // const user = await models.User.findByPk(id); 
            const user = await this.findOne(id);
            const res = await user.update(changes);
            return res;
        }

        async delete(id) {
            // const user =  await models.User.findByPk(id);
            const user = await this.findOne(id);
            await user.destroy()
            return {id};
        }
    }

    ~~~
10. Verifica cada uno de tus servicios creados
11. Mejoremos las respuestas del ORM
    1. Trae el manejador de errores del ORM a tu carpeta "middlewares" a tu archivo errorhandler.js
        ~~~
        const { ValidationError }= require('sequelize');
        ~~~
    2. Agrega tu funcion manejadora de error y exportala.
        ~~~
        const ormErrorHandler=(err, req, res, next)=>{
        if(err instanceof ValidationError){ //si mi error es una instancia de mi ORM...
            res.status(409).json({ //todos estos errores serán 409
            statusCode: 409,
            message: err.name,
            errors: err.errors
            });
        }
        next(err); //devuelve esto en caso de error.
        }

        module.exports = { logErrors, errorHandler, boomErrorHandler,ormErrorHandler}

        ~~~
    3. Agrega tu funcion como segundo de tus middlewares en index.js
        ~~~
        app.use(logErrors);
        app.use(ormErrorHandler);
        app.use(boomErrorHandler);
        app.use(errorHandler);
        ~~~
    4. Puedes probar este middleware tratando de crear un usuario con un correo existente.
    <img src="utils/images/testOrmHandlerErrors.png"/>

## Migraciones
1. Instalar libreria de Sequelize cli
    ~~~
        npm i sequelize-cli --save-dev
    ~~~
2. Crear archivo .sequelizerc en la raíz del proyecto
    ~~~
        module.exports={
            'config': './db/config.js',
            'models-path': './db/models/',
            'migrations-path': './db/migrations/',
            'seeders-path': './db/seeders/'
        }
    ~~~
3. Crea esas carpetas en tu sitema de archivos (cambia models de lugar), dentro de db crea config.js 
   ~~~
    const { config } = require('../config/config');

    const USER = encodeURIComponent( config.dbUser );
    const PASSWORD = encodeURIComponent( config.dbPassword );
    const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

    module.exports = {
        development:{
            url:URL,
            dialect: 'postgres',
        },
        production:{
            url:URL,
            dialect: 'postgres',
        }
    }
   ~~~
4. Configura scripts para correr migraciones
   ~~~
      "scripts": {
        "dev": "nodemon index.js",
        "start": "node index.js",
        "lint": "eslint",
        "migrations:generate": "sequelize-cli migration:generate --name" //crear estructura de migracion
        "migrations:run": "sequelize-cli db:migrate",   // generar migracion
        "migrations:revert": "sequelize-cli db:migrate:undo", // Deshacer migreacion
        "migrations:delete": "sequelize-cli db:migrate:undo:all" // Limpiar todas las migraciones ( boton de autodestruir )
   ~~~
5. Crea tu migracion de usuarios
   ~~~
    $ npm run migrations:generate create-user
   ~~~
## Modificación de Tablas.
Para modificar las tablas deberás crear una migración nueva, de esta manera aseguras que no eliminas toda la tabla y sus registros sino que solo agregas o remueves algunos campos. 
1. El primer paso es modificar tu modelo, en este caso agregamos un user role.
   ~~~
     password:{
        allowNull: false,
        type: DataTypes.STRING
    },
    role:{
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue:"costumer" 
    },
    createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
    }
   ~~~
2. Después hay que crear la migracion.
   ~~~
    npm run migrations:generate add-role
   ~~~
3. En la migración que se ha creado hay que agregar las especificaciones de los movimientos hechos
   ~~~
    'use strict';
    const {UserSchema, USER_TABLE} = require('./../models/user.model')
    module.exports = {
    async up (queryInterface) {
        await queryInterface.addColumn( USER_TABLE, 'role', UserSchema.role);
        /**
        * Puedes agregar más cambios aquí....
        */
    },
    async down (queryInterface) {
        await queryInterface.removeColumn( USER_TABLE, 'role');
        /**
        * Pero recuerda agregarlos aca también 
        */
    }
    };
   ~~~
4. Finalmente debemos actualizar nuestra base de datos. 
   ~~~
    npm run migrations:run
   ~~~
5. Para verificar que se ha agregado correctamente el campo de role, podemos hacer una petición http. Solo recuerda antes descomentar los campos de nuestro schema User
   ~~~
   const Joi = require('joi');

    const id = Joi.number().integer();
    const email = Joi.string().email();
    const password = Joi.string().min(8);
    const role = Joi.string().min(5)

    const createUserSchema = Joi.object({
    email: email.required(),
    password: password.required(),
    role: role
    });

    const updateUserSchema = Joi.object({
    email: email,
    role: role,
    });

    const getUserSchema = Joi.object({
    id: id.required(),
    });

    module.exports = { createUserSchema, updateUserSchema, getUserSchema }

   ~~~
   Y ahora las peticiones.... <br>
   Creamos los usuarios, agregando el role en la peticion  
   <img src="utils/images/createOneUser.png"/> 
   <br>
   Ahora listamos todos los usuarios...<br>
   <img src="utils/images/getAllUsers.png"/> 
## Relaciones.
Para crear asociaciones, primero definiremos una tabla de costumers
1. Crear y definir el modelo costumer.model en la carpeta de models.
    ~~~
    const { Model, DataTypes, Sequelize } = require('sequelize');
    const COSTUMER_TABLE = 'costumers'; //definir nombre tabla;
    const CostumerSchema = {
        id:{
            allowNull:false, //no puede ser falso
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        lastName:{
            allowNull: false,
            type: DataTypes.STRING,
            field: "last_name"
        },
        phone:{
            allowNull: false,
            type: DataTypes.STRING 
        },
        createdAt:{
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: Sequelize.NOW,
        }
    }
    class Costumer extends Model{
        static associciate(){
            //assocciate
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: COSTUMER_TABLE,
                modelName: 'Costumer',
                timestamps: false 
            }
        }
    }
    module.exports= {COSTUMER_TABLE,CostumerSchema,Costumer };
    ~~~
2. Agregar el modelo al index de models
   ~~~
    const { User, UserSchema }= require('./user.model');
    const { Costumer, CostumerSchema }= require('./costumer.model');

    function setupModels(sequelize){
        User.init(UserSchema, User.config( sequelize ));
        Costumer.init(CostumerSchema, Costumer.config( sequelize ));
    }
    module.exports = setupModels
   ~~~
3. Crear costumer.schema.js de nuestro modelo dentro de schemas.
   ~~~
    const Joi = require('joi');

    const id = Joi.number().integer();
    const name = Joi.string().min(3).max(30);
    const lastName = Joi.string().min(3).max(30);
    const phone = Joi.string().length(10);

    const createCostumerSchema = Joi.object({
        name: name.required(),
        lastName: lastName.required(),
        phone: phone.required()
    });

    const updateCostumerSchema = Joi.object({
        name: name,
        lastName: lastName,
        phone: phone
    });

    const getCostumerSchema = Joi.object({
        id: id.required(),
    });

    module.exports = { createCostumerSchema, updateCostumerSchema, getCostumerSchema }

   ~~~

4. Crear nuestra ruta costumer.router.js en routes
   ~~~
    const express = require('express');

    const CostumerService = require('./../services/costumer.service');
    const validatorHandler = require('./../middlewares/validator.handler');
    const { updateCostumerSchema, createCostumerSchema, getCostumerSchema } = require('./../schemas/costumer.schema');

    const router = express.Router();
    const service = new CostumerService();

    router.get('/', async (req, res, next) => {
    try {
        const categories = await service.find();
        res.json(categories);
    } catch (error) {
        next(error);
    }
    });

    router.get('/:id',
    validatorHandler(getCostumerSchema, 'params'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        const category = await service.findOne(id);
        res.json(category);
        } catch (error) {
        next(error);
        }
    }
    );

    router.post('/',
    validatorHandler(createCostumerSchema, 'body'),
    async (req, res, next) => {
        try {
        const body = req.body;
        const newCategory = await service.create(body);
        res.status(201).json(newCategory);
        } catch (error) {
        next(error);
        }
    }
    );

    router.patch('/:id',
    validatorHandler(getCostumerSchema, 'params'),
    validatorHandler(updateCostumerSchema, 'body'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        const body = req.body;
        const category = await service.update(id, body);
        res.json(category);
        } catch (error) {
        next(error);
        }
    }
    );

    router.delete('/:id',
    validatorHandler(getCostumerSchema, 'params'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        await service.delete(id);
        res.status(201).json({id});
        } catch (error) {
        next(error);
        }
    }
    );

    module.exports = router;
   ~~~
5. Agregar nuestras rutas costumer a nuestro index de router
   ~~~
    const express = require('express');

    const productsRouter = require('./products.router');
    const categoriesRouter = require('./categories.router');
    const usersRouter = require('./users.router');
    const orderRouter = require('./orders.router');

    function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/products', productsRouter);
    router.use('/categories', categoriesRouter);
    router.use('/users', usersRouter);
    router.use('/orders', orderRouter);
    }

    module.exports = routerApi;
   ~~~
6. Crear los servicios para costumer
   ~~~
    const boom = require('@hapi/boom');
    const {models} = require('../libs/sequelize');
    // const {Sequelize} = require('sequelize');

    class CostumerService {
    constructor() {}

    async create(data) {
        const newUser =  await models.Costumer.create( data) //crear
        return newUser;
    }

    async find() {
        const res = await models.Costumer.findAll();
        return res;
    }

    async findOne(id) {
        const res  =  await models.Costumer.findByPk(id);// buscar con id
        if(!res){
        boom.notFound('User Not Found');
        }
        return res;
    }

    async update(id, changes) {
        // const user = await models.User.findByPk(id); 
        const costumer = await this.findOne(id);
        const res = await costumer.update(changes);
        return res;
    }

    async delete(id) {
        // const user =  await models.User.findByPk(id);
        const costumer = await this.findOne(id);
        await costumer.destroy()
        return {id};
    }
    }

    module.exports = CostumerService;
   ~~~
7. Definir metodo de relaciones en costumer.model
   ~~~
    const { Model, DataTypes, Sequelize } = require('sequelize');
    const {USER_TABLE} = require('./user.model');
    const COSTUMER_TABLE = 'costumers'; //definir nombre tabla;
    const CostumerSchema = {
        id:{
            allowNull:false, //no puede ser falso
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        lastName:{
            allowNull: false,
            type: DataTypes.STRING,
            field: "last_name"
        },
        phone:{
            allowNull: false,
            type: DataTypes.STRING 
        },
        createdAt:{
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: Sequelize.NOW,
        },
        userId:{
            field:"user_id",
            allowNull: false,
            type: DataTypes.INTEGER,
            references:{
                model: USER_TABLE, //importa tu modelo User
                key: 'id',
            },
            onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
            onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
        }
    }
    class Costumer extends Model{
        static associciate(models){
            this.belongsTo( models.User, {as:'user'} ) //Costummer belongs to User, con el pseudonimo user
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: COSTUMER_TABLE,
                modelName: 'Costumer',
                timestamps: false 
            }
        }
    }
    module.exports= {COSTUMER_TABLE,CostumerSchema,Costumer };
   ~~~
8. Agregar las relaciones después de las migraciones a nuestro index de models.
   ~~~
    const { User, UserSchema }= require('./user.model');
    const { Costumer, CostumerSchema }= require('./costumer.model');

    function setupModels(sequelize){
        User.init(UserSchema, User.config( sequelize ));
        Costumer.init(CostumerSchema, Costumer.config( sequelize ));
        /**
        * After to do all tables, you must to define the relations
        */
        Costumer.associations( sequelize.models )
    }
    module.exports = setupModels
   ~~~
9. Crear la migración create-costumer.
    ~~~
        npm migrations:generate create-costumer
    ~~~
    Modifica tu migración...
    ~~~
    'use strict';
    const {CostumerSchema, COSTUMER_TABLE} = require('./../models/costumer.model');
    module.exports = {
        async up (queryInterface) {
            await queryInterface.createTable( COSTUMER_TABLE, CostumerSchema );
        },

        async down (queryInterface) {
            await queryInterface.dropTable( COSTUMER_TABLE );
        }
    };
    ~~~

10. Crear la tabla costumer con npm run migrations:run
    ~~~
        npm run migrations:run
    ~~~
11. Comprueba que todo haya salido bien con algunas consultas, creando usuarios y comprobando que se hayan agregado correctamente.<br>
   <img src="utils/images/comprobacionTablas.png"/> 
## Como corregir un error al levantar una relación uno a uno.
En el modulo anterior se creó una relación uno a uno, pero el resultado no es el mejor, debido a que la columna donde se relaciónan el user_id no es unica, por tanto más de un usuario podría tener un costumer. Al tener pocos datos en tu base no hay problema con borrarla y crearla de nueva, pero en caso de que ya tuvieras muchos registros lo mejor es corregirlo. Aquí se demustra cómo hacerlo.
1. Modifica el campo para hacerlo unique.
   ~~~
    userId:{
        field:"user_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
        references:{
            model: USER_TABLE, //importa tu modelo User
            key: 'id',
        },
        onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
        onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
    }
   ~~~
2. Crea tu nueva migración.
   ~~~
    npm run migrations:generate change-user-id
   ~~~
   Y modifica tu migración
   ~~~
    'use strict';
    const { DataTypes } = require('sequelize');
    const { COSTUMER_TABLE } = require('./../models/costumer.model');
    module.exports = {
        async up (queryInterface) {
            await queryInterface.changeColumn( COSTUMER_TABLE,'user_id',{
            field:"user_id",
                allowNull: false,
                type: DataTypes.INTEGER,
                unique: true
            });
        },
    };
   ~~~  
3. Actualiza tu tabla
   ~~~
    npm run migrations:run 
   ~~~
4. Intenta crear más de un usuario con el mismo foreign key. Recibirás un error
    <img src="utils/images/uniqueKey.png"/> <br>

### De esta manera hemos resuelto el error de la relación uno a uno

## Hacer relación uno a uno belongTo
1. Modifica tu clase de Costumer en tu modelo costumer
   ~~~
    class Costumer extends Model{
        static associciate(models){
            this.belongsTo( models.User, {as:'user'} ) //Costummer belongs to User, con el pseudonimo user
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: COSTUMER_TABLE,
                modelName: 'Costumer',
                timestamps: false 
            }
        }
    }
   ~~~
2. Declara tu relación en tu index de modelos
    ~~~
        function setupModels(sequelize){
        User.init(UserSchema, User.config( sequelize ));
        Costumer.init(CostumerSchema, Costumer.config( sequelize ));
        /**
        * After to do all tables, you must to define the relations
        */
        Costumer.associciate( sequelize.models ) //=> relación nueva
        }
    ~~~
3. Modifica tu servicio de findAll en el archivo de costumer.service.js 
   ~~~
    async find() {
        const res = await models.Costumer.findAll({
            include:['user']
        });
        return res;
    }
   ~~~
4. Realiza una consulta para obtner los valores de costumer embebidos 
    <img src="utils/images/relationsOnetoOne.png"/> <br>
   
## Relación uno a uno de ambos lados (bidireccional).
Para hacer que la relación creada hacía Costumers con un id de usuario, pero del lado de usuario, es decir que mediante la llave foranea muestre el costumer que tiene vinulado. Tenemos que hacer lo sigueinte.
1. Modifica tu clase de Users en tu modelo user
   ~~~
    class User extends Model{
        static associciate(models){
            this.hasOne( models.Costumer, 
                {
                    as:'costumer', 
                    foreignKey:'userId'
                }
            );   
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: USER_TABLE,
                modelName: 'User',
                timestamps: false 
            }
        }
    }
   ~~~
2. Declara tu relación en tu index de modelos
~~~
    function setupModels(sequelize){
    User.init(UserSchema, User.config( sequelize ));
    Costumer.init(CostumerSchema, Costumer.config( sequelize ));
    /**
     * After to do all tables, you must to define the relations
     */
    User.associciate( sequelize.models ) //=>Asociacion nueva
    Costumer.associciate( sequelize.models )
}
~~~
3. Modifica tu servicio de findAll.
   ~~~
    async find() {
        const res = await models.User.findAll({
        include:['costumer']
        });
        return res;
    }
   ~~~
4. Realiza una consulta para obtener los valores de costumer embebidos 
    <img src="utils/images/findAllUser.png"/> <br>
   
## Eliminar el objeto incómodo. Limpiar datos de respuesta tras un vínculo (enviar arreglo unidimencional)
Al hacer un vinculo entre dos tablas queda embebida en la respuesta una de las tablas, esta es devuelta dentro de un arreglo.<br>
    <img src="utils/images/test2.png"/> <br>

Para devolver una cantidad especifica de campos y en un arreglo unidimencional sigue los pasos...
1. Ve a tu servicio costumer.service.js y modifica...
   ~~~
    async find() {
        const res = []
        const queryRes = await models.Costumer.findAll(
        {
            attributes:[
            'id',
            'name',
            'lastName'
            ],
            include:[
                {
                    model:models.User, 
                    as:'user', 
                    attributes:['email', 'role'] 
                }
            ]
        }
        );
        queryRes.map(el=>res.push({id:el.id,name:el.name,lastName:el.lastName,email:el.user.email, role:el.user.role}))
        return res;
    }
   ~~~ 
   1.   En attributes elige las columnas (attributes) de tu tabla modelo, en este caso Costumer, 
   2.   En include trae tu vinculo, elige el modelo a usar, y su alias que definiste, después coloca las columnas que quieres traer.
   3.   Por último itera la respuesta recibida, recuerda que las incluciones son devueltas dentro de un objeto por ello deberás sacarlas del mismo para devolver una consulta limpia.
2.  Prueba tu petición trayendo todos tus Costumers
    <img src="utils/images/test.png"/> <br>
    Tu respuesta ahora es más limpia.

## Automatiza tu creación de usuarios.
1. Modifica tu schema de costumers para incluir el arreglo que requieres
   ~~~
    const id = Joi.number().integer();
    const name = Joi.string().min(3).max(30);
    const lastName = Joi.string().min(3).max(30);
    const phone = Joi.string().length(10);
    const userId = Joi.number().integer();
    const email = Joi.string().email();
    const password = Joi.string().min(8).max(20);

    const createCostumerSchema = Joi.object({
        name: name.required(),
        lastName: lastName.required(),
        phone: phone.required(),
        user:Joi.object({
            email: email.required(),
            password: password.required()
        })
    });
   ~~~
2. Modifica tu servicio de costumers para agregar tu asociaciones
    ~~~ 
    async create(data) {
        const newCostumer =  await models.Costumer.create( data, 
            {
                include:['user']
            }
        ) //crear
        return newCostumer;
    }
    ~~~
3. Intenta crear un nuevo costumer y verifica que se cree también un usuario nuevo.
    <img src="utils/images/userCascade.png"/> <br>

## hasMany relaciones uno a muchos
1. Crear modelos y asociaciones hasMany y belongTo de productos y categorias
    1. Modelo products y asociacion belongTo.
    ~~~
    const { Model, DataTypes, Sequelize } = require('sequelize');
    const PRODUCT_TABLE = 'products'; //definir nombre tabla;
    const ProductSchema = {
        id:{
            allowNull:false, //no puede ser falso
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        price:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        image:{
            allowNull: false,
            type: DataTypes.STRING
        },
        createdAt:{
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: Sequelize.NOW,
        },
        categoryId:{
            field:"category_id",
            allowNull: false,
            type: DataTypes.INTEGER,
            references:{
                model: PRODUCT_TABLE, //importa tu modelo User
                key: 'id',
            },
            onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
            onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
        }

    }
    class Product extends Model{
        static associciate(models){
            this.belongsTo( models.Category, 
                {
                    as:'category'
                }
            );   
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: PRODUCT_TABLE,
                modelName: 'Product',
                timestamps: false 
            }
        }
    }
    module.exports= {PRODUCT_TABLE,ProductSchema,Product };
    ~~~
    2. Modelo Category y relacion hasMany.
    ~~~
    const { Model, DataTypes, Sequelize } = require('sequelize');
    // const {USER_TABLE} = require('./user.model');
    const CATEGORY_TABLE = 'category'; //definir nombre tabla;
    const CategorySchema = {
        id:{
            allowNull:false, //no puede ser falso
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        image:{
            allowNull: false,
            type: DataTypes.STRING,
        },
        createdAt:{
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: Sequelize.NOW,
        }
    }
    class Category extends Model{
        static associciate(models){
            this.hasMany( models.Products, 
                {
                    as:'product',
                    foreignKey:'categoryId'

                } 
            ) 
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: CATEGORY_TABLE,
                modelName: 'Category',
                timestamps: false 
            }
        }
    }
    module.exports= {CATEGORY_TABLE,CategorySchema,Category };
    ~~~
2. Crear tablas y Vincular asociaciones en models/index
   ~~~
    const { User, UserSchema }= require('./user.model');
    const { Costumer, CostumerSchema }= require('./costumer.model');
    const { Product, ProductSchema } = require('./product.model');
    const { Category, CategorySchema } = require('./category.model');

    function setupModels(sequelize){
        User.init(UserSchema, User.config( sequelize ));
        Costumer.init(CostumerSchema, Costumer.config( sequelize ));
        Product.init(ProductSchema, Product.config( sequelize ));
        Category.init(CategorySchema, Category.config( sequelize ));

        /**
        * After to do all tables, you must to define the relations
        */
        User.associciate( sequelize.models );
        Costumer.associciate( sequelize.models );
        Product.associciate( sequelize.models );
        Category.associciate( sequelize.models );
    }
    module.exports = setupModels
   ~~~
3. Crear migraciones.
   Generar archivo para las migraciones.
   ~~~
   npm run migrations:generate create-product-and-category
   ~~~
   <br>
   Dentro del archivo generado...<br>
   ~~~
    'use strict';
    const { CATEGORY_TABLE, CategorySchema } = require('../models/category.model');
    const { PRODUCT_TABLE, ProductSchema } = require('../models/product.model');
    module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable( PRODUCT_TABLE , ProductSchema );
        await queryInterface.createTable( CATEGORY_TABLE, CategorySchema );

    },
    async down (queryInterface) {
        await queryInterface.dropTable( PRODUCT_TABLE );
        await queryInterface.dropTable( CATEGORY_TABLE);
    }
    };
   ~~~
4. Correr migraciones.
   ~~~
   npm run migrations:run
   ~~~
   verifica la creación de ambas tablas.
5. Modificar servicios.
   Category service.
   ~~~
    const boom = require('@hapi/boom');
    const {models} = require('../libs/sequelize');
    // const {Sequelize} = require('sequelize');

    class CategoryService {
        constructor() {}

        async create(data) {
            // console.log("AQUI!!", Sequelize);
            const newUser =  await models.Category.create( data ) //crear
            return newUser;
        }

        async find() {
            const res = await models.Category.findAll();
            return res;
        }

        async findOne(id) {
            const res  =  await models.Category.findByPk(id,
            {
                include:['product']
            });// buscar con id
            if(!res){
            boom.notFound('Category Not Found');
            }
            return res;
        }

        async update(id, changes) {
            // const user = await models.Category.findByPk(id); 
            const user = await this.findOne(id);
            const res = await user.update(changes);
            return res;
        }

        async delete(id) {
            // const user =  await models.Category.findByPk(id);
            const user = await this.findOne(id);
            await user.destroy()
            return {id};
        }
    }

    module.exports = CategoryService;

   ~~~

6. Modificar rutas.
   ~~~
    const express = require('express');

    const productsRouter = require('./products.router');
    const categoriesRouter = require('./categories.router');
    const usersRouter = require('./users.router');
    const orderRouter = require('./orders.router');
    const costumerRouter = require('./costumer.router');

    function routerApi(app) {
        const router = express.Router();
        app.use('/api/v1', router);
        router.use('/products', productsRouter);
        router.use('/categories', categoriesRouter);
        router.use('/users', usersRouter);
        router.use('/orders', orderRouter);
        router.use('/costumers', costumerRouter);
        router.use('/categories', categoriesRouter);
        router.use('/products', productsRouter);
    }

    module.exports = routerApi;

   ~~~
7.  Modificar productSchema para que reciba el id de la categoria.
    ~~~
        const Joi = require('joi');

        const id = Joi.number().integer();
        const name = Joi.string().min(3).max(30);
        const price = Joi.number().integer().min(10);
        const image = Joi.string().uri();
        const categoryId = Joi.number().integer();

        const createProductSchema = Joi.object({
        name: name.required(),
        price: price.required(),
        image: image.required(),
        categoryId,
        });

        const updateProductSchema = Joi.object({
        name: name,
        price: price,
        image: image
        });

        const getProductSchema = Joi.object({
        id: id.required(),
        });

        module.exports = { createProductSchema, updateProductSchema, getProductSchema }

    ~~~
8.  Verificar relaciones haciendo consultas a la bd
    <img src="utils/images/Categories.png"/> <br>

## belongsToMany relaciones muchos a muchos (configuracion).
1. Crear order.model.js. Esta es una tabla pivote que debe tener una relación entre los costumers y las ordenes.
   ~~~
    const { Model, DataTypes, Sequelize } = require('sequelize');
    const { COSTUMER_TABLE } = require('./costumer.model');
    const ORDER_TABLE = 'orders'; //definir nombre tabla;
    const OrderSchema = {
        id:{
            allowNull:false, //no puede ser falso
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        createdAt:{
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: Sequelize.NOW,
        },
        costumerId:{
            field:"costumer_id",
            allowNull: false,
            type: DataTypes.INTEGER,
            references:{
                model: COSTUMER_TABLE, //importa tu modelo User
                key: 'id',
            },
            onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
            onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
        }

    }
    class Order extends Model{
        static associciate(models){
        this.belongsTo( models.Costumer, {as:'costumer'} ); 
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: ORDER_TABLE,
                modelName: 'Order',
                timestamps: false 
            }
        }
    }
    module.exports= {ORDER_TABLE,OrderSchema,Order };
   ~~~
    El metodo associciate  indica el tipo de relación que tendrán las tablas en este caso una orden le pertence a un usuario.
    Por otro lado se debe indicar en costumers que puede tener varias ordenes
    ~~~
    class Costumer extends Model{
        static associciate(models){
            this.belongsTo( models.User, {as:'user'} ) //Costummer belongs to User, con el pseudonimo user
            this.hasMany( models.Order, 
                {
                    as:'orders',
                    foreignKey: "costumerId"
                } 
            )
        }
        static config(sequelize){
            return{
                sequelize,
                tableName: COSTUMER_TABLE,
                modelName: 'Costumer',
                timestamps: false 
            }
        }
    }
    ~~~
2. Parametrizar migraciones y asociaciones.
    ~~~
        const { User, UserSchema }= require('./user.model');
        const { Costumer, CostumerSchema }= require('./costumer.model');
        const { Product, ProductSchema } = require('./product.model');
        const { Category, CategorySchema } = require('./category.model');
        const { Order, OrderSchema } = require('./order.model');

        function setupModels(sequelize){
            User.init(UserSchema, User.config( sequelize ));
            Costumer.init(CostumerSchema, Costumer.config( sequelize ));
            Product.init(ProductSchema, Product.config( sequelize ));
            Category.init(CategorySchema, Category.config( sequelize ));
            Order.init(OrderSchema, Order.config( sequelize ));

            /**
            * After to do all tables, you must to define the relations
            */
            User.associciate( sequelize.models );
            Costumer.associciate( sequelize.models );
            Product.associciate( sequelize.models );
            Category.associciate( sequelize.models );
            Order.associciate( sequelize.models );   
        }
        module.exports = setupModels
    ~~~
3. Crear migracion
   ~~~
   npm run migrations:generate create-order
   ~~~
   Configurar arhivo.
   ~~~
   'use strict';
    const { ORDER_TABLE, OrderSchema } = require('../models/order.model');
    module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable( ORDER_TABLE , OrderSchema );

    },
    async down (queryInterface) {
        await queryInterface.dropTable( ORDER_TABLE );
    }
    };
   ~~~
    Correr migraciones
    ~~~
    npm run migrations:run
    ~~~
4. Crear los servicios.
   ~~~
    const boom = require('@hapi/boom');
    const {models} = require('../libs/sequelize');
    class OrderService {

    constructor(){
    }
    async create(data) {
        const order = await models.Order.create(data);
        return order;
    }

    async find() {
        const orders = await models.Order.findAll({
        include:['costumer']
        });
        return orders;
    }

    async findOne(id) {
        const order = await models.Order.findByPk(id);
        if (!order) {
        throw boom.notFound('order not found');
        }
        if (order.isBlock) {
        throw boom.conflict('order is block');
        }
        return order;
    }

    async delete(id) {
        const order = await this.findOne(id);
        await order.destroy();
        return {id};
    }

    }

    module.exports = OrderService;
   ~~~
5. Crear rutas orders.router.
   ~~~
    const express = require('express');

    const OrderService = require('./../services/order.service');
    const validatorHandler = require('./../middlewares/validator.handler');
    const { createOrderSchema, getOrderSchema } = require('./../schemas/order.schema');

    const router = express.Router();
    const service = new OrderService();

    router.get('/', async (req, res, next) => {
    try {
        const order = await service.find();
        res.json(order);
    } catch (error) {
        next(error);
    }
    });

    router.get('/:id',
    validatorHandler(getOrderSchema, 'params'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        const order = await service.findOne(id);
        res.json(order);
        } catch (error) {
        next(error);
        }
    }
    );

    router.post('/',
    validatorHandler(createOrderSchema, 'body'),
    async (req, res, next) => {
        try {
        const body = req.body;
        const newOrder = await service.create(body);
        res.status(201).json(newOrder);
        } catch (error) {
        next(error);
        }
    }
    );
    router.delete('/:id',
    validatorHandler(getOrderSchema, 'params'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        await service.delete(id);
        res.status(201).json({id});
        } catch (error) {
        next(error);
        }
    }
    );

    module.exports = router;

    ~~~
6. Crear Schema
   ~~~
    const Joi = require('joi');

    const costumerId = Joi.number().integer();
    const id = Joi.number().integer();

    const createOrderSchema = Joi.object({
        costumerId:costumerId.required()
    });

    const getOrderSchema = Joi.object({
        id: id.required(),
    });

    module.exports = { createOrderSchema, getOrderSchema }
   ~~~
7. Prueba tus rutas...
    <img src="utils/images/testOrders.png"/> <br>

## Resolver Asociaciones anidadas.
Al relacionar nuestra tabla "orders" con "costumers" podemos ver los datos del costumer asociado a la orden. Pero un costumer a su vez está asociado a un usuario. Así podríamos a su vez ver los usuarios asociados.

1. Crear la asociacion de los modelos en una petición.
   ~~~
      async findOne(id) {
        const order = await models.Order.findByPk(id,{
        include:{
            association: 'costumer',
            include: ['user']
        }
        });
        if (!order) {
            throw boom.notFound('order not found');
        }
        if (order.isBlock) {
            throw boom.conflict('order is block');
        }
        return order;
    }
   ~~~

2. Realizar una petición para probar la funcion.
    Antes.
    ~~~       
        {
            "id": 1,
            "createdAt": "2022-09-08T21:35:03.919Z",
            "costumerId": 1,
            "costumer": {
                "id": 1,
                "name": "Alejandro",
                "lastName": "Morales",
                "phone": "5545029885",
                "createdAt": "2022-09-06T16:35:21.556Z",
                "userId": 1,
            }
        }
    ~~~
    Despues
    ~~~
        {
            "id": 1,
            "createdAt": "2022-09-08T21:35:03.919Z",
            "costumerId": 1,
            "costumer": {
                "id": 1,
                "name": "Alejandro",
                "lastName": "Morales",
                "phone": "5545029885",
                "createdAt": "2022-09-06T16:35:21.556Z",
                "userId": 1,
                "user": {
                    "id": 1,
                    "email": "alex@gmail.com",
                    "password": "094923211312",
                    "role": "costumer",
                    "createdAt": "2022-09-06T16:34:08.513Z"
                }
            }
        }
    ~~~

## Asociaciones Multiples.
La tabla de Costumers tiene una asociacion uno a uno con usuarios y uno a muchos con ordenes por tanto podemos hacer esto..
1. Crear las asociaciones entre los modelos en una peticion 
    ~~~
    async findAllOrders(id) {
        // const ordersArray = []
        const orders = await  models.Costumer.findByPk(id,{
        attributes:[
            'id',
            'name',
            'lastName'

        ],
        include:[
            {model:models.Order , as:'orders', attributes:['id', 'createdAt']},
            {model:models.User, as:'user', attributes:['email', 'role']}

        ]
        });
        // orders.map(el=>ordersArray.push({id:el.id,name:el.name,lastName:el.lastName,email:el.user.email, role:el.user.role}))
        return orders;
    }
    ~~~
2. Crear la ruta para nuestra funcion
   ~~~
        router.get('/orders/:id', 
        // validatorHandler(getCostumerSchema, 'params'),
        async (req, res, next) => {
            try {
            const { id } = req.params;
            const costumer = await service.findAllOrders(id);
            res.json(costumer);
            } catch (error) {
            next(error);
            }
        }
        );
   ~~~

3. Realizar una consulta.
    ~~~
        {
        "id": 1,
        "name": "Alejandro",
        "lastName": "Morales",
        "orders": [
            {
            "id": 1,
            "createdAt": "2022-09-08T21:35:03.919Z"
            },
            {
            "id": 3,
            "createdAt": "2022-09-08T21:35:16.198Z"
            }
        ],
        "user": {
            "email": "alex@gmail.com",
            "role": "costumer"
        }
        }
    ~~~
## belongsToMany relaciones muchos a muchos.
1. Crear Modelo de la tabla pivote.
    ~~~
        const { Model, DataTypes, Sequelize } = require('sequelize');
        const { ORDER_TABLE } = require('./order.model');
        const { PRODUCT_TABLE } = require('./product.model');
        const ORDER_PRODUCT_TABLE = 'orders_products'; //definir nombre tabla;
        const OrderProductSchema = {
            id:{
                allowNull:false, //no puede ser falso
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            createdAt:{
                allowNull: false,
                type: DataTypes.DATE,
                field: 'created_at',
                defaultValue: Sequelize.NOW,
            },
            amount:{
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            orderId:{
                field:"order_id",
                allowNull: false,
                type: DataTypes.INTEGER,
                references:{
                    model: ORDER_TABLE, //importa tu modelo User
                    key: 'id',
                },
                onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
                onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
            },
            productId:{
                field:"product_id",
                allowNull: false,
                type: DataTypes.INTEGER,
                references:{
                    model: PRODUCT_TABLE, //importa tu modelo User
                    key: 'id',
                },
                onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
                onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
            }

        }
        class OrderProduct extends Model{
            static associciate(){
                //
            }
            static config(sequelize){
                return{
                    sequelize,
                    tableName: ORDER_PRODUCT_TABLE,
                    modelName: 'OrderProduct',
                    timestamps: false 
                }
            }
        }
        module.exports= {ORDER_PRODUCT_TABLE,OrderProductSchema,OrderProduct };
    ~~~
2. Crear migraciones
   ~~~
   npm run migrations:generate create-orders_products
   ~~~
   configurar archivo.
   ~~~
    'use strict';
    const { ORDER_PRODUCT_TABLE, OrderProductSchema } = require('../models/order_product.model');
    module.exports = {
        async up (queryInterface) {
            await queryInterface.createTable(ORDER_PRODUCT_TABLE,OrderProductSchema);
        },

        async down (queryInterface) {
            await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
        }
    };
   ~~~
   Agregar configuracion del modelo al index.
   ~~~
    const { User, UserSchema }= require('./user.model');
    const { Costumer, CostumerSchema }= require('./costumer.model');
    const { Product, ProductSchema } = require('./product.model');
    const { Category, CategorySchema } = require('./category.model');
    const { Order, OrderSchema } = require('./order.model');
    const { OrderProduct, OrderProductSchema } = require('./order_product.model');

    function setupModels(sequelize){
        User.init(UserSchema, User.config( sequelize ));
        Costumer.init(CostumerSchema, Costumer.config( sequelize ));
        Product.init(ProductSchema, Product.config( sequelize ));
        Category.init(CategorySchema, Category.config( sequelize ));
        Order.init(OrderSchema, Order.config( sequelize ));
        OrderProduct.init(OrderProductSchema, OrderProduct.config( sequelize ));
        /**
        * After to do all tables, you must to define the relations
        */
        User.associciate( sequelize.models );
        Costumer.associciate( sequelize.models );
        Product.associciate( sequelize.models );
        Category.associciate( sequelize.models );
        Order.associciate( sequelize.models );   
    }
    module.exports = setupModels
   ~~~
   Correr migraciones.
   ~~~
    npm run migrations:run
   ~~~
3. Crear Schema para agregar productos a una orden de compra
   ~~~
    const Joi = require('joi');

    const costumerId = Joi.number().integer();
    const id = Joi.number().integer();
    const orderId = Joi.number.integer();
    const productId = Joi.number.integer();
    const amount = Joi.number.integer().min(1);


    const createOrderSchema = Joi.object({
        costumerId:costumerId.required()
    });

    const getOrderSchema = Joi.object({
        id: id.required(),
    });

    const addItemSchema = Joi.object({
        orderId: orderId.required(),
        productId: productId.required(),
        amount: amount.required()
    })

    module.exports = { createOrderSchema, getOrderSchema,addItemSchema }
   ~~~
4. Crea un nuevo metodo post para agregar un item en order.router
   ~~~
        router.post('/add-item',
        validatorHandler(addItemSchema, 'body'),
        async (req, res, next) => {
            try {
            const body = req.body;
            const newItem = await service.addItem(body);
            res.status(201).json(newItem);
            } catch (error) {
            next(error);
            }
        }
        );
   ~~~
5. Crea un nuevo servicio para ese metodo.
   ~~~
        async addItem(data) {
            const item = await models.Order.create(data);
            return item;
        }
   ~~~
6. Agregar la asociacion "items" para el servicio de findOne.
    ~~~
        async findOne(id) {
            const order = await models.Order.findByPk(id,
                {
                    include:[
                    {
                        association: 'costumer',
                        include: ['user']
                    },
                    'items'
                    ]
                }
            );
            if (!order) {
                throw boom.notFound('order not found');
            }
            if (order.isBlock) {
                throw boom.conflict('order is block');
            }
            return order;
        }
    ~~~
7. Probar las rutas.
   ~~~
    {
        "id": 1,
        "createdAt": "2022-09-08T21:35:03.919Z",
        "costumerId": 1,
        "costumer": {
            "id": 1,
            "name": "Alejandro",
            "lastName": "Morales",
            "phone": "5545029885",
            "createdAt": "2022-09-06T16:35:21.556Z",
            "userId": 1,
            "user": {
            "id": 1,
            "email": "alex@gmail.com",
            "password": "094923211312",
            "role": "costumer",
            "createdAt": "2022-09-06T16:34:08.513Z"
            }
        },
        "items": [
            {
                "id": 1,
                "name": "Arete espanta pesadillas",
                "price": 2000,
                "image": "https://pixabay.com/es/photos/mujer-colores-estilo-438434/",
                "createdAt": "2022-09-06T22:00:15.834Z",
                "categoryId": 1,
                "OrderProduct": {
                    "id": 3,
                    "createdAt": "2022-09-09T17:49:26.642Z",
                    "amount": 1,
                    "orderId": 1,
                    "productId": 1
                }
            },
            {
                "id": 2,
                "name": "Aretes de circonía verde",
                "price": 1300,
                "image": "https://www.istockphoto.com/es/foto/pendientes-con-esmeralda-gm1350815428-426779577",
                "createdAt": "2022-09-06T22:39:53.462Z",
                "categoryId": 1,
                "OrderProduct": {
                    "id": 1,
                    "createdAt": "2022-09-09T17:49:13.332Z",
                    "amount": 2,
                    "orderId": 1,
                    "productId": 2
                }
            }
        ]
    }
   ~~~
## Calcular total de columnas.(no lo hagas con una cantidad mayor a 100 campos)
1. Debes setear el atributo como campo virtual para indicar a Sequelize que no debe aparecer en la tabla
    ~~~
        total:{
            type: DataTypes.VIRTUAL,
            get(){
                if( this.items.lenght > 0){
                    return this.items.reduce((total, item)=>{
                        return total + ( item.price * item.OrderProduct.amount)
                    },0)
                }
                return 0;
            }
        }
    ~~~
2. Prueba la funcionalidad
   ~~~
    {
        "items": [
            {
                "id": 1,
                "name": "Arete espanta pesadillas",
                "price": 2000,
                "image": "https://pixabay.com/es/photos/mujer-colores-estilo-438434/",
                "createdAt": "2022-09-06T22:00:15.834Z",
                "categoryId": 1,
                "OrderProduct": {
                    "id": 3,
                    "createdAt": "2022-09-09T17:49:26.642Z",
                    "amount": 1,
                    "orderId": 1,
                    "productId": 1
                }
            },
            {
                "id": 2,
                "name": "Aretes de circonía verde",
                "price": 1300,
                "image": "https://www.istockphoto.com/es/foto/pendientes-con-esmeralda-gm1350815428-426779577",
                "createdAt": "2022-09-06T22:39:53.462Z",
                "categoryId": 1,
                "OrderProduct": {
                    "id": 1,
                    "createdAt": "2022-09-09T17:49:13.332Z",
                    "amount": 2,
                    "orderId": 1,
                    "productId": 2
                }
            }
        ]
    }
   ~~~
## Paginacion con limit y offset
Limit es el numero de elementos a devolver y Offset son los elemetos que se quieren escapar o eludir
1. Configura tu schema para recibir un limit y un offset
   ~~~
    const Joi = require('joi');

    const id = Joi.number().integer();
    const name = Joi.string().min(3).max(30);
    const price = Joi.number().integer().min(10);
    const image = Joi.string().uri();
    const categoryId = Joi.number().integer();
    const limit = Joi.number().integer();
    const offset = Joi.number().integer();

    const createProductSchema = Joi.object({
    name: name.required(),
    price: price.required(),
    image: image.required(),
    categoryId,
    });

    const updateProductSchema = Joi.object({
    name: name,
    price: price,
    image: image,
    categoryId
    });

    const getProductSchema = Joi.object({
    id: id.required(),
    });

    const queryProductSchema = Joi.object({
    limit: limit.required(),
    offset: offset.required(),
    });

    module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema }

   ~~~
2. Coloca tu limit y offset de forma dinamica en tu consulta.
   ~~~
        async find(query) {
            const options = {
                include:['category']
            }
            const {limit, offset} = query;
            if(limit && offset){
                options.limit = limit;
                options.offset = offset;
            }
            const products = await models.Product.findAll(options);
            return products;
        }
    ~~~
3. Configura tu ruta para agregar los parametros inmersos en "query" y tu schema.
   ~~~
    router.get('/', async (req, res, next) => {
    validatorHandler(queryProductSchema, 'query')
    try {
        const products = await service.find(req.query);
        res.json(products);
    } catch (error) {
        next(error);
    }
    });
   ~~~
4. Haz pruebas de funcionalidad
   Para un limit= 3 y un offset = 3 el resultado es.
   ~~~
    [
        {
            "id": 4,
            "name": "pulsera negra",
            "price": 2100,
            "image": "https://www.istockphoto.com/es/foto/negro-en-blanco-pulsera-en-mano-pulsera-marca-festival-de-la-m%C3%BAsica-accesorio-de-gm1063084064-284215643",
            "createdAt": "2022-09-09T19:44:48.637Z",
            "categoryId": 3,
            "category": null
        },
        {
            "id": 6,
            "name": "Aretes negros!",
            "price": 1130,
            "image": "https://www.istockphoto.com/es/foto/negro-en-blanco-pulsera-en-mano-pulsera-marca-festival-de-la-m%C3%BAsica-accesorio-de-gm1063084064-284215643",
            "createdAt": "2022-09-09T19:58:38.461Z",
            "categoryId": 6,
            "category": {
                "id": 6,
                "name": "Pulseras",
                "image": "https://pixabay.com/es/photos/oro-cadena-pulsera-joyas-joyer%c3%ada-665722/",
                "createdAt": "2022-09-09T19:43:23.296Z"
            }
        },
        {
            "id": 7,
            "name": "Aretes negros1",
            "price": 1130,
            "image": "https://www.istockphoto.com/es/foto/negro-en-blanco-pulsera-en-mano-pulsera-marca-festival-de-la-m%C3%BAsica-accesorio-de-gm1063084064-284215643",
            "createdAt": "2022-09-09T19:58:48.667Z",
            "categoryId": 6,
            "category": {
                "id": 6,
                "name": "Pulseras",
                "image": "https://pixabay.com/es/photos/oro-cadena-pulsera-joyas-joyer%c3%ada-665722/",
                "createdAt": "2022-09-09T19:43:23.296Z"
            }
        }
    ]
   ~~~
## Agrega un buscador de precio.
1. Modificamos nuestro schema para recibir optativamente un precio
   ~~~
    const queryProductSchema = Joi.object({
        limit,
        offset,
        price
    });
   ~~~
2. Modificamos el servicio para recibir de manera dinamica un valor en el precio.
   ~~~
        async find(query) {
            const options = {
                include:['category'],
                where:{}
            }
            const {limit, offset} = query;
            if(limit && offset){
                options.limit = limit;
                options.offset = offset;
            }
            const {price} = query;
            if( price ){
                options.where.price = price;
            }
            const products = await models.Product.findAll(options);
            return products;
        }
   ~~~
3. Probamos la implementacion
    Si envio un como queryparam un price =150
    ~~~
    [
        {
            "id": 4,
            "name": "Playera Gris",
            "price": 150,
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238",
            "createdAt": "2022-09-12T19:00:53.710Z",
            "categoryId": 1,
            "category": {
            "id": 1,
            "name": "Shirts",
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238/",
            "createdAt": "2022-09-12T15:58:05.498Z"
            }
        },
        {
            "id": 5,
            "name": "Playera Roja",
            "price": 150,
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238",
            "createdAt": "2022-09-12T19:01:02.460Z",
            "categoryId": 1,
            "category": {
            "id": 1,
            "name": "Shirts",
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238/",
            "createdAt": "2022-09-12T15:58:05.498Z"
            }
        }
    ]
    ~~~
## Agrega un buscador por rango  de precio.
1. Modifica tu schema para que si recibe un valor minimo, sea obligatorio recibir un valor máximo. 
   ~~~
   const Joi = require('joi');

    const id = Joi.number().integer();
    const name = Joi.string().min(3).max(30);
    const price = Joi.number().integer().min(10);
    const image = Joi.string().uri();
    const categoryId = Joi.number().integer();
    const limit = Joi.number().integer();
    const offset = Joi.number().integer();
    const priceMax = Joi.number().integer();
    const priceMin = Joi.number().integer();

    const createProductSchema = Joi.object({
    name: name.required(),
    price: price.required(),
    image: image.required(),
    categoryId,
    });

    const updateProductSchema = Joi.object({
    name: name,
    price: price,
    image: image,
    categoryId
    });

    const getProductSchema = Joi.object({
    id: id.required(),
    });

    const queryProductSchema = Joi.object({
    limit,
    offset,
    price,
    priceMin,
    priceMax: priceMax.when('priceMin', {
        is: Joi.number().integer(),
        then: Joi.required()
    })
    });

    module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema }

   ~~~
2. Modifica tu consulta, importa Op y crea de manera dinamica si es que se reciben los valores por defecto en el query buscador
   ~~~
    const boom = require('@hapi/boom');
    const {models} = require('../libs/sequelize');
    const { Op } = require("sequelize");

    class ProductsService {
    constructor(){
    }
    async create(data) {
        const product = await models.Product.create(data)
        return product;
    }

    async find(query) {
        const options = {
        include:['category'],
        where:{}
        }
        const {limit, offset} = query;
        if(limit && offset){
        options.limit = limit;
        options.offset = offset;
        }
        const{priceMax, priceMin } = query;
        if(priceMax && priceMin){
        options.where.price={
            [Op.gte]: priceMin,
            [Op.lte]: priceMax
        }
        }

        const {price} = query;
        if( price ){
        options.where.price = price;
        }

        const products = await models.Product.findAll(options);
        return products;
    }

    async findOne(id) {
        const product  =  await models.Product.findByPk(id);// buscar con id
        if (!product) {
        throw boom.notFound('product not found');
        }
        if (product.isBlock) {
        throw boom.conflict('product is block');
        }
        return product;
    }

    async update(id, changes) {
        const product = await this.findOne(id);
        const res = await product.update(changes);
        return res;
    }

    async delete(id) {
        const product = await this.findOne(id);
        await product.destroy();
        return { id };
    }
    }
    module.exports = ProductsService;
   ~~~
3. Haciendo una consulta de los valores 50 y 120, maximo y minimo respectivamente.
   ~~~
    [
        {
            "id": 1,
            "name": "Playera Negra",
            "price": 50,
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238",
            "createdAt": "2022-09-12T15:58:53.680Z",
            "categoryId": 1,
            "category": {
            "id": 1,
            "name": "Shirts",
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238/",
            "createdAt": "2022-09-12T15:58:05.498Z"
            }
        },
        {
            "id": 2,
            "name": "Playera Blanca",
            "price": 100,
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238",
            "createdAt": "2022-09-12T16:27:22.162Z",
            "categoryId": 1,
            "category": {
            "id": 1,
            "name": "Shirts",
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238/",
            "createdAt": "2022-09-12T15:58:05.498Z"
            }
        },
        {
            "id": 3,
            "name": "Playera Azul",
            "price": 120,
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238",
            "createdAt": "2022-09-12T19:00:46.347Z",
            "categoryId": 1,
            "category": {
            "id": 1,
            "name": "Shirts",
            "image": "https://www.istockphoto.com/es/foto/maqueta-de-camiseta-de-manga-corta-para-hombres-en-las-vistas-delantera-y-trasera-gm1328049157-412223238/",
            "createdAt": "2022-09-12T15:58:05.498Z"
            }
        }
    ]
   ~~~
## Deploy Heroku
1. Sube tus cambios a github.
   ~~~
    git push origin main
   ~~~
2. Agrega tu repo a Heroku.
   ~~~
    heroku git:remote a -name-project-on-heroku
   ~~~
3. Crear las gestiones para la base de datos que quiero que sea almacenada
   ~~~
    heroku addons:create heroku-postgresql:hobby-dev
   ~~~
4. Crea una variable de entorno con tu URL de produccion
   ~~~
   PORT = 3030
    DB_USER='adminUser'
    DB_PASSWORD='password'
    DB_HOST='localhost'
    DB_NAME='my_store'
    DB_PORT='5432'
    DATABASE_URL = 'postgres://adminUser:password@localhost:5432/my_store'
   ~~~
5. Crea una variable de entorno que indique si estás o no en produccion
   ~~~
   require('dotenv').config();
    const config={
        env: process.env.NODE_ENV || 'dev',
        isProduction: process.env.NODE_ENV === 'production',
        port: process.env.PORT || 3030,
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbPort: process.env.DB_PORT,
        dbURL: process.env.DATABASE_URL
    }
    module.exports = {config};
   ~~~
6. En tu config.db crea la logica que indique si es que estamos o no en produccion
   ~~~
   const { config } = require('../config/config');

    module.exports = {
        development:{
            url: config.dbURL,
            dialect: 'postgres',
        },
        production:{
            url:config.dbURL,
            dialect: 'postgres',
            ssl:{
                rejectUnauthorized: false
            }
        }
    }
   ~~~
7. Indica el proceso de produccion tambien dentro de sequelize
   ~~~
    const { Sequelize } = require('sequelize');
    const { config } = require('../config/config');
    const setupModels = require('../db/models');

    const options = {
        dialect: 'postgres',
        logging: config.isProduction ? false : true, //mostrar la traducción a sql de las peticioes hechas
    }
    if(config.isProduction){
        options.ssl = {
            rejectUnauthorized: false
        }
    }
    const sequelize =  new Sequelize(config.dbURL, options )
    setupModels(sequelize);

    // sequelize.sync( ); //No es la mejor practica es mejor usar migraciones

    module.exports = sequelize;
   ~~~
8. Realiza pruebas de coneccion.
    <img src="utils/images/test3.png"/><br>
    Si aún te devuelve valores quiere decir que ahora está tomando tu cadena larga creada del lado de config, lo que significa que ya estás listo para reemplazar esa cadena por los valores que te entregue heroku 
9. Crea una nueva rama para no trabajar con tu rama main
    ~~~
        git checkout -b production
    ~~~
10. haz tu deployment
    ~~~
        git push heroku production:main
    ~~~




## (Pendiente) Agrega MySQL para practicar cambio de bases de datos
1. Crea la imagen de mysql y de phpmyadmin
    ~~~
        mysql:
            image: mysql:5
            environment:
            - MYSQL_ALLOW_EMPTY_PASSWORD=yes
            - MYSQL_DATABASE=my_store
            - MYSQL_USER=adminUser
            - MYSQL_PASSWORD=password
            - MYSQL_PORT=3301
            ports:
            - 3301:3301
            volumes:
            - ./data/mysql_data:/var/lib/mysql
        
        phpmyadmin:
            image: phpmyadmin/phpmyadmin
            environment:
            - MYSQL_ROOT_PASSWORD=admin123
            - PMA_HOST=mysql
            ports:
            - 7171:80
    ~~~
2. Agrega la carpeta data a .gitignore
    ~~~
        # DB    
        data


    ~~~
3. Verificar que los cuatro contenedores estén corriendo adecuadamente 
    ~~~
        $ docker ps
        CONTAINER ID   IMAGE                   COMMAND                  CREATED        STATUS          PORTS                                         NAMES
        a5c345fc7389   phpmyadmin/phpmyadmin   "/docker-entrypoint.…"   18 hours ago   Up 14 seconds   0.0.0.0:7171->80/
        6de53cab715d   mysql:5                 "docker-entrypoint.s…"   18 hours ago   Up 13 seconds   3306/tcp, 0.0.0.0:3301->3301/
        cfd76d71eafe   dpage/pgadmin4          "/entrypoint.sh"         45 hours ago   Up 13 seconds   443/tcp, 0.0.0.0:7070->80/
        878b526c79f1   postgres:13             "docker-entrypoint.s…"   45 hours ago   Up 13 seconds   0.0.0.0:5432->5432/
    ~~~