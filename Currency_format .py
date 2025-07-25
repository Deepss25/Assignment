def format_indian_currency(num):
    num = str(num)
    if '.' in num:
        integer, decimal = num.split('.')
        decimal = '.' + decimal
    else:
        integer = num
        decimal = ''

    if len(integer) <= 3:
        return integer + decimal

    main_part = integer[-3:]
    rest = integer[:-3]

    ind_formatted = ''
    while len(rest) > 2:
        ind_formatted = ',' + rest[-2:] + ind_formatted
        rest = rest[:-2]

    if rest:
        ind_formatted = rest + ind_formatted

    return ind_formatted + ',' + main_part + decimal

# Input
num_input = input("Enter the number: ")
try:
    num = float(num_input)
    print("Formatted:", format_indian_currency(num))
except ValueError:
    print("Invalid number input.")
