import app from './app.ts'
import './database.ts'

app.listen(app.get('port'), () => {
    console.log('Server is running at port', app.get('port'))
})
