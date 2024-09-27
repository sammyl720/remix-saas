import { Form } from '@remix-run/react';

export default function Pricing() {
  const prices = [
    { id: 'price_1PzTMTDlYjeoDGlwdpEUz6Ca', name: 'Basic', price: '$10/month' },
    { id: 'price_1Q3QSBDlYjeoDGlw8xPqyUie', name: 'Pro', price: '$20/month' },
  ];

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>
      <div className="flex justify-center space-x-6">
        {prices.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-teal-950 p-6 rounded shadow w-64">
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <p className="text-xl mb-6">{plan.price}</p>
            <Form method="post" action="/checkout">
              <input type="hidden" name="priceId" value={plan.id} />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
              >
                Select
              </button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
