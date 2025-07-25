def minimize_loss(prices):
    min_loss = float('inf')
    buy_year = sell_year = -1

    price_to_year = {price: i for i, price in enumerate(prices)}
    sorted_prices = sorted(prices, reverse=True)

    for i in range(len(sorted_prices)):
        for j in range(i + 1, len(sorted_prices)):
            buy_price = sorted_prices[i]
            sell_price = sorted_prices[j]

            if price_to_year[buy_price] < price_to_year[sell_price]:
                loss = buy_price - sell_price
                if 0 < loss < min_loss:
                    min_loss = loss
                    buy_year = price_to_year[buy_price] + 1
                    sell_year = price_to_year[sell_price] + 1

    return buy_year, sell_year, min_loss

# Input
n = int(input("Enter number of years: "))
prices = list(map(int, input("Enter prices separated by space: ").split()))

buy, sell, loss = minimize_loss(prices)
print(f"Buy in year {buy}, Sell in year {sell}, Loss = {loss}")
