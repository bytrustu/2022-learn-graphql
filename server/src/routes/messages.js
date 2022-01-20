import {readDB, writeDB} from '../dbController.js'
import {v4} from 'uuid'

const getMessages = () => readDB('messages')
const setMessgaes = data => writeDB('messages', data)

const messagesRoute = [{
    method: 'get', route: '/messages', handler: (req, res) => {
        const msgs = getMessages()
        res.send(msgs)
    }
}, {
    method: 'get', route: '/messages/:id', handler: ({params: {id}}, res) => {
        try {
            const msgs = getMessages()
            const msg = msgs.find(msg => msg.id === id)
            if (!msg) throw Error('not found')
            res.send(msg)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }
}, {
    method: 'post', route: '/messages', handler: ({body}, res) => {
        const msgs = getMessages()
        const newMsg = {
            id: v4(), text: body.text, userId: body.userId, timestamp: Date.now(),
        }
        msgs.unshift(newMsg)
        setMessgaes(msgs)
        res.send(newMsg)
    }
}, {
    method: 'put', route: '/messages', handler: ({body, params: {id}}, res) => {
        try {
            const msgs = getMessages()
            const targetIndex = msgs.findIndex(msg => msg.id === id)
            if (targetIndex < 0) throw '메세지가 없습니다'
            if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다'
            const newMsgs = {...msgs[targetIndex], text: body.text}
            msgs.splice(targetIndex, 1, newMsgs)
            setMessgaes(msgs)
            res.send(newMsgs)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }
}, {
    method: 'delete', route: '/messages', handler: ({body, params: {id}}, res) => {
        try {
            const msgs = getMessages()
            const targetIndex = msgs.findIndex(msg => msg.id === id)
            if (targetIndex < 0) throw '메세지가 없습니다'
            if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다'
            msgs.splice(targetIndex, 1)
            setMessgaes(msgs)
            res.send(id)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }
},]

export default messagesRoute