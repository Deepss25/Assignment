import json

def combine_lists(list1, list2):
    combined = list1 + list2
    combined.sort(key=lambda x: x['positions'][0])

    result = []
    for current in combined:
        if not result:
            result.append(current)
        else:
            prev = result[-1]
            l1, r1 = prev['positions']
            l2, r2 = current['positions']

            overlap = max(0, min(r1, r2) - max(l1, l2))
            len_current = r2 - l2
            if overlap > len_current / 2:
                prev['values'].extend(current['values'])
            else:
                result.append(current)
    return result

# Input (You can paste a list in the given format)
print("Enter List 1 in JSON format: [{'positions': [0, 5], 'values': [1, 2]}]")
list1 = json.loads(input())
print("Enter List 2 in JSON format:")
list2 = json.loads(input())

combined_result = combine_lists(list1, list2)
print("Combined List:", json.dumps(combined_result, indent=2))
