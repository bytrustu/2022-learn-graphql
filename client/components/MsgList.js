import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from '../fetcher'

const userIds = ['joon', 'bytrustu']
const getRandomUserId = () => userIds[Math.round(Math.random())]

const originalMsgs = []

const MsgList = () => {
    const { query: { userId = '' } } = useRouter()
    const [msgs, setMsgs] = useState(originalMsgs)
    const [editingId, setEditingId] = useState(null)

    const onCreate = async (text) => {
        const newMsg = await fetcher('post', '/messages', { text, userId })
        if (!newMsg) throw Error('something wrong')
        setMsgs(msgs => ([newMsg, ...msgs]))
    }

    const doneEdit = () => {
        setEditingId(null)
    }

    const onUpdate = async (text, id) => {
        const newMsg = await fetcher('put', `/messages/50`, { text, userId })
        if (!newMsg) throw Error('something wrong')
        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === id)
            if (targetIndex < 0) return msgs
            const newMsgs = [...msgs]
            newMsgs.splice(targetIndex, 1, newMsgs)
            return newMsgs
        })
        doneEdit()
    }

    const onDelete = id => {
        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === id)
            if (targetIndex < 0) return msgs
            const newMsg = [...msgs]
            newMsg.splice(targetIndex, 1)
            return newMsg
        })
        doneEdit()
    }

    const getMessages = async () => {
        const msgs = await fetcher('get', '/messages')
        setMsgs(msgs)
    }

    useEffect(() => {
        getMessages()
    }, [])

    return (
        <>
            <MsgInput mutate={onCreate}/>
            <ul className='messages'>
                {
                    msgs.map(x => (
                            <MsgItem
                                {...x}
                                key={x.id}
                                onUpdate={() => { onUpdate(x.text, x.id)}}
                                onDelete={() => { onDelete(x.id) }}
                                isEditing={editingId === x.id}
                                startEdit={() => setEditingId(x.id)}
                                myId={userId}
                            />
                        )
                    )
                }
            </ul>
        </>
    )
}

export default MsgList;