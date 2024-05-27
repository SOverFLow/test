import { FC } from 'react'
import { Text } from '@react-pdf/renderer'
import compose from '../styles/compose'

interface Props {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  pdfMode?: boolean;
  multiline?: boolean; // New prop to determine if the input should allow multiple lines
}

const EditableInputMulty: FC<Props> = ({
  className,
  placeholder,
  value,
  onChange,
  pdfMode,
  multiline
}) => {
  const inputClassName = `input ${className || ''}`;
  return (
    <>
      {pdfMode ? (
        <Text style={compose('span ' + className)}>{value}</Text>
      ) : multiline ? (
        <textarea
          className={inputClassName}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          rows={4} // Default number of rows, you can make this a prop as well if needed
        />
      ) : (
        <input
          type="text"
          className={inputClassName}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </>
  )
}

export default EditableInputMulty;
