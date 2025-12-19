
export const StockPill = ({ stock = 0 }) => {
    const isInStock = stock > 0;

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-max ${isInStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}
        >
            {isInStock ? 'In Stock' : 'Out of Stock'}
        </span>
    );
};