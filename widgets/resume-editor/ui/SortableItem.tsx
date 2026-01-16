import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    onRemove?: () => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as 'relative',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative group ${isDragging ? 'shadow-lg ring-2 ring-indigo-200 rounded-xl' : ''}`}>
            {children}

            {/* Controls Overlay - Positioned securely inside the item context */}
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                {/* Drag Handle */}
                <button
                    type="button"
                    className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded cursor-grab active:cursor-grabbing touch-none"
                    {...attributes}
                    {...listeners}
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                {/* Remove Button */}
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded"
                        title="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};
