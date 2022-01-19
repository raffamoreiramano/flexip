import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import styles from './styles.module.css'

export default function Reorderable({
    id,
    state,
    className,
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
            <Droppable droppableId={droppableId} children={(provided) => (
                <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles.list}
                >
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
                                            id={index + 1}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            style={{
                                                ...style,
                                                transition,
                                            }}
                                        >
                                            <div className={`${styles.item} glass`}>
                                                { content(item) }
                                            </div>
                                        </li>
                                    );
                                }}/>
                            );
                        })
                    }
                    { provided.placeholder }
                </ol>
            )}/>
        </DragDropContext>
    );
}