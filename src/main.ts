import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"


const start = async () => {
  try {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.listen(PORT, () => console.log(`Server running on ${PORT} port`))
  } catch (e) {
    console.log(e)
  }
}

start()