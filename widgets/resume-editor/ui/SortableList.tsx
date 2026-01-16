import React, { useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    SortingStrategy
} from '@dnd-kit/sortable';

interface SortableListProps<T extends { id: string }> {
    items: T[];
    onChange: (items: T[]) => void;
    renderItem: (item: T) => React.ReactNode;
    strategy?: SortingStrategy;
}

export function SortableList<T extends { id: string }>({
    items,
    onChange,
    renderItem,
    strategy = verticalListSortingStrategy
}: SortableListProps<T>) {

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            onChange(arrayMove(items, oldIndex, newIndex));
        }
    }

    const itemIds = useMemo(() => items.map(item => item.id), [items]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={itemIds}
                strategy={strategy}
            >
                <div className="space-y-4">
                    {items.map((item) => (
                        <React.Fragment key={item.id}>
                            {renderItem(item)}
                        </React.Fragment>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
