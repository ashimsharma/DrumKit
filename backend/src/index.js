import {app} from "./app.js";
import connectDB from "./db/index.js";

connectDB()
.then(response => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on PORT ${process.env.PORT || 8000}`);
    });

    console.log("DB Connection Host", response.connection.host);
})
.catch((err) => {
    console.log(err?.message);
})