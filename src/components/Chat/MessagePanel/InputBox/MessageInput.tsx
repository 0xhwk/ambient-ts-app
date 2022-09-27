/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMoralis } from 'react-moralis';
import {
    //  useEffect,
    useState,
} from 'react';
import { BsSlashSquare, BsEmojiSmileFill } from 'react-icons/bs';
// import { Message } from '../../Model/MessageModel';
import Picker from 'emoji-picker-react';
// import { socket } from '../../Service/chatApi';
import styles from './MessageInput.module.css';

// interface MessageInputProps {
//     message: Message;
//     room: string;
// }

export default function MessageInput() {
    // export default function MessageInput(props: MessageInputProps) {
    // const _socket = socket;

    // useEffect(() => {
    //     _socket.connect();
    // }, [_socket]);

    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { isWeb3Enabled, isAuthenticated } = useMoralis();

    const handleEmojiClick = (event: any, emoji: any) => {
        let msg = message;
        msg += emoji.emoji;
        setMessage(msg);
    };

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    // const _handleKeyDown = (e: any) => {
    //     if (e.key === 'Enter') {
    //         handleSendMsg(e.target.value);
    //         setMessage('');
    //         setShowEmojiPicker(false);
    //     }
    // };

    // const handleSendMsg = async (msg: string) => {
    //     _socket.emit('send-msg', {
    //         from: '62f24f3ff40188d467c532e8',
    //         to: '62fa389c897f9778e2eb863f',
    //         message: msg,
    //         roomInfo: props.room,
    //     });
    // };

    const onChangeMessage = (e: any) => {
        setMessage(e.target.value);
    };

    return (
        <div className={styles.input_box}>
            <div className={styles.input}>
                <input
                    type='text'
                    id='box'
                    placeholder={
                        !isAuthenticated || !isWeb3Enabled
                            ? 'Please log in to chat.'
                            : 'Enter Message...'
                    }
                    disabled={!isAuthenticated || !isWeb3Enabled}
                    className={styles.input_text}
                    onKeyDown={() => {
                        null;
                    }}
                    // onKeyDown={_handleKeyDown}
                    value={message}
                    onChange={onChangeMessage}
                />
                <BsSlashSquare />
                <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
            </div>
            {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                    <Picker
                        pickerStyle={{ width: '100%', height: '95%' }}
                        onEmojiClick={handleEmojiClick}
                    />
                </div>
            )}
        </div>
    );
}