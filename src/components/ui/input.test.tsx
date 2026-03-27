import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('test')
  })

  it('renders with default value', () => {
    render(<Input defaultValue="default value" />)
    expect(screen.getByRole('textbox')).toHaveValue('default value')
  })

  it('renders with controlled value', () => {
    render(<Input value="controlled value" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('controlled value')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn()
    render(<Input disabled onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders different input types', () => {
    const { rerender, container } = render(<Input type="text" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    // Password inputs don't have textbox role, so we query by element
    const passwordInput = container.querySelector('input[type="password"]')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('renders with name attribute', () => {
    render(<Input name="username" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username')
  })

  it('renders with id attribute', () => {
    render(<Input id="email-input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-input')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    expect(handleFocus).toHaveBeenCalledOnce()
    
    await userEvent.tab()
    expect(handleBlur).toHaveBeenCalledOnce()
  })

  it('handles keyboard events', async () => {
    const handleKeyDown = vi.fn()
    const handleKeyUp = vi.fn()
    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'a')
    
    expect(handleKeyDown).toHaveBeenCalled()
    expect(handleKeyUp).toHaveBeenCalled()
  })

  it('renders with required attribute', () => {
    render(<Input required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('renders with readonly attribute', () => {
    render(<Input readOnly />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('renders with maxLength attribute', () => {
    render(<Input maxLength={10} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10')
  })

  it('renders with min and max for number type', () => {
    render(<Input type="number" min={0} max={100} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('handles paste events', async () => {
    const handlePaste = vi.fn()
    render(<Input onPaste={handlePaste} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.paste('pasted text')
    
    expect(handlePaste).toHaveBeenCalled()
  })

  it('maintains focus after value change', async () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    
    await userEvent.click(input)
    await userEvent.type(input, 'test')
    
    expect(input).toHaveFocus()
  })

  it('handles clear functionality if supported', async () => {
    render(<Input defaultValue="test" />)
    const input = screen.getByRole('textbox')
    
    await userEvent.clear(input)
    
    expect(input).toHaveValue('')
  })
})