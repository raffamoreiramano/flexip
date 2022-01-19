import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { VscGrabber } from 'react-icons/vsc';

import styles from './styles.module.css'

export default function Reorderable({
    id,
    state,
    className,
    ordered,
    content = (item) => {}
}) {
    const [list, setList] = state;
    className = className ? `${className} ${styles.reorderable}` : styles.reorderable;

    const droppableId = id ? "droppable-" + id : "droppable-" + className;

    return (
        <DragDropContext onDragEnd={(event, provided) => {
            const { destination, source } = event;
            let items = [...list];

            const [dragged] = items.splice(source.index, 1);

            if (destination) {
                const half = items.splice(destination.index);

                items = [...items, dragged, ...half];
            }

            setList(items);
        }}>
            <Droppable droppableId={droppableId} children={(provided) => {
                const children = (<>
                    {
                        list.map((item, index) => {
                            return (
                                <Draggable key={item.id} draggableId={`${item.id}`} index={index} children={(provided, snapshot) => {
                                    let { style } = provided.draggableProps;
                                    let { transition } = style;

                                    if (snapshot.isDropAnimating) {
                                        transition = snapshot.draggingOver ? transition : '1ms';
                                    }

                                    return (
                                        <li
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            style={{
                                                ...style,
                                                transition,
                                            }}
                                        >
                                            <div id={index + 1} className={`${styles.item} glass`}>
                                                <div className={styles.content}>
                                                    { content(item) }
                                                </div>
                                                <i><VscGrabber/></i>
                                            </div>
                                        </li>
                                    );
                                }}/>
                            );
                        })
                    }
                    { provided.placeholder }
                </>);
                
                return ordered ? (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.list}
                        children={children}
                    />
                )
                : (
                    <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.list}
                        children={children}
                    />
                );
            }}/>
        </DragDropContext>
    );
}