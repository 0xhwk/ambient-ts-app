import styles from './Accordion.module.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
    id: number | string;
    children?: React.ReactNode;
}

export default function Accordion(props: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { children } = props;

    return (
        <>
            <motion.div onClick={() => setIsOpen((prev) => !prev)}>
                {/* Accordion {props.id} is {isOpen ? 'open' : 'closed'} */}
                {children}
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key='content'
                        initial='collapsed'
                        animate='open'
                        exit='collapsed'
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div style={{ fontSize: '10px' }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis unde
                            cumque, dicta maxime sequi ad? Minus explicabo accusamus dignissimos
                            neque impedit autem nemo sint adipisci dolore ipsam
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}