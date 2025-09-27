const varName = "NEXT_PUBLIC_DB_HOST";
const env = process.env;
export default function EnvPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">EnvPage ("use server")</h1>
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
            <td className="py-2 px-4 border-b border-gray-200">HANDY</td>
            <td className="py-2 px-4 border-b border-gray-200">
              {process.env.HANDY}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">
              process.env.NEXT_PUBLIC_DB_HOST
            </td>
            <td className="py-2 px-4 border-b border-gray-200">
              {process.env.NEXT_PUBLIC_DB_HOST}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">
              process.env["NEXT_PUBLIC_DB_HOST"]
            </td>
            <td className="py-2 px-4 border-b border-gray-200">
              {process.env["NEXT_PUBLIC_DB_HOST"]}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">
              process.env[varName]
            </td>
            <td className="py-2 px-4 border-b border-gray-200">
              {process.env[varName]}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">
              env.NEXT_PUBLIC_DB_HOST
            </td>
            <td className="py-2 px-4 border-b border-gray-200">
              {env.NEXT_PUBLIC_DB_HOST}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">env[varName]</td>
            <td className="py-2 px-4 border-b border-gray-200">
              {env[varName]}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
