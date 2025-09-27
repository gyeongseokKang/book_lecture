export default function EnvOrderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">EnvPage ("order")</h1>
      <table className=" bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Key
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">
              process.env.FILE
            </td>
            <td className="py-2 px-4 border-b border-gray-200">
              {process.env.FILE}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
