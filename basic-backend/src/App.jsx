import React from 'react'

const App = () => {

  return (
<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="w-[350px] bg-white rounded-2xl shadow-lg p-6">

    {/* <!-- Title --> */}
    <h1 class="text-xl font-semibold text-center text-gray-800">
      Currency Converter
    </h1>
    <p class="text-sm text-gray-500 text-center mt-1">
      Check live rates, set alerts & more
    </p>

    {/* <!-- Card --> */}
    <div class="mt-6 bg-gray-50 rounded-xl p-4">

      {/* <!-- Amount --> */}
      <div>
        <p class="text-sm text-gray-500 mb-2">Amount</p>
        <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
          <div class="flex items-center gap-2">
            <img src="https://flagcdn.com/w40/sg.png" class="w-6 h-6 rounded-full" />
            <span class="font-medium">SGD</span>
          </div>
          <input 
            type="text" 
            value="1000.00" 
            class="w-24 text-right outline-none bg-gray-100 px-2 py-1 rounded-md"
          />
        </div>
      </div>

      {/* <!-- Swap Button --> */}
      <div class="flex justify-center my-4">
        <button class="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
          ⇅
        </button>
      </div>

      {/* <!-- Converted --> */}
      <div>
        <p class="text-sm text-gray-500 mb-2">Converted Amount</p>
        <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
          <div class="flex items-center gap-2">
            <img src="https://flagcdn.com/w40/us.png" class="w-6 h-6 rounded-full" />
            <span class="font-medium">USD</span>
          </div>
          <input 
            type="text" 
            value="736.70" 
            class="w-24 text-right outline-none bg-gray-100 px-2 py-1 rounded-md"
          />
        </div>
      </div>

    </div>

    {/* <!-- Exchange Rate --> */}
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-400">Indicative Exchange Rate</p>
      <p class="font-medium text-gray-700 mt-1">
        1 SGD = 0.7367 USD
      </p>
    </div>

  </div>
</div>
  )
}

export default App