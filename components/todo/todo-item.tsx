import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { createTodoSchema as validationSchema } from 'libs/validation';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
  }).isRequired,
  onChangeTodo: PropTypes.func.isRequired,
  onRemoveTodo: PropTypes.func.isRequired,
};
const TodoItem: React.FC<PropTypes.InferProps<typeof propTypes>> = ({
  todo,
  onChangeTodo,
  onRemoveTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [validationError, setValidationError] = useState<string>(null);
  useEffect(() => {
    try {
      setValidationError(null);
      validationSchema.validateSync({ text });
    } catch (error) {
      setValidationError(error.message);
    }
  }, [text]);

  return (
    <ListItem
      divider
      button
      ContainerProps={{ 'aria-label': `Double click to edit ${todo.text}` }}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={todo.done}
          inputProps={{
            'aria-label': todo.done ? 'Mark as undone' : 'Mark as done',
          }}
          onChange={event => onChangeTodo({ done: event.target.checked })}
        />
      </ListItemIcon>
      <ListItemText
        id={todo.id}
        primary={
          isEditing ? (
            <TextField
              fullWidth
              value={text}
              error={!!validationError}
              helperText={validationError}
              onChange={event => setText(event.target.value)}
              onBlur={() => {
                setIsEditing(false);
                if (todo.text !== text) onChangeTodo({ text });
              }}
              onKeyUp={event => {
                switch (event.key) {
                  case 'Escape':
                    setIsEditing(false);
                    break;

                  case 'Enter':
                    setIsEditing(false);
                    if (todo.text !== text) onChangeTodo({ text });
                    break;
                }
              }}
            />
          ) : (
            todo.text
          )
        }
        secondary={DateTime.fromISO(
          todo.done ? todo.updatedAt : todo.createdAt,
        ).toRelative()}
        onDoubleClick={() => setIsEditing(prevIsEditing => !prevIsEditing)}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label={`Delete todo: ${todo.text}`}
          onClick={onRemoveTodo}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
TodoItem.propTypes = propTypes;

export default TodoItem;
