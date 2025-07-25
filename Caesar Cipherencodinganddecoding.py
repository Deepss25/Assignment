def caesar_cipher(message, shift, mode='encode'):
    result = []
    shift = shift % 26
    if mode == 'decode':
        shift = -shift

    for char in message:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result.append(new_char)
        else:
            result.append(char)

    return ''.join(result)

# Input
message = input("Enter the message: ")
shift = int(input("Enter the shift value: "))
mode = input("Enter 'encode' or 'decode': ").strip().lower()

result = caesar_cipher(message, shift, mode)
print(f"Result: {result}")
