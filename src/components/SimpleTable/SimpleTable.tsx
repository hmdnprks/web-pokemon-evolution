interface TableProps {
  headers: string[];
  data: any[];
}

const SimpleTable = ({ headers, data }: TableProps) => {
  return (
    <div className="overflow-x-auto relative mt-2">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header, index) => (
              <th className="py-3 px-6" key={`header-${index}`} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any[], index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"
              key={`row-${index}`}
            >
              {row.map((cell: any, index) => (
                <td className="py-3 px-6 whitespace-nowrap" key={`row-${index}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
