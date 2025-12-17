import React from 'react'
import Link from 'next/link'

const sampleConfigs = [
	{ id: 'company-settings', name: 'Company Settings', description: 'Pay date, time zone, currency, pay cycle' },
	{ id: 'tax-documents', name: 'Tax Documents', description: 'Create and download employee tax forms' },
	{ id: 'disputes', name: 'Payroll Disputes', description: 'Submit or review payroll error disputes' },
]

export default function PayrollConfigurationPage() {
	return (
		<main className="px-6 py-8 max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Payroll Configurations</h1>
				<Link href="./new" className="rounded bg-indigo-600 text-white px-3 py-2 text-sm">Add Configuration</Link>
			</div>

			<p className="mb-4 text-sm text-gray-600">Manage payroll settings used during payroll execution.</p>

			<ul className="space-y-4">
				{sampleConfigs.map((c) => (
					<li key={c.id} className="p-4 border rounded-md flex items-center justify-between">
						<div>
							<div className="font-medium">{c.name}</div>
							<div className="text-sm text-gray-600">{c.description}</div>
						</div>
						<div className="flex items-center gap-3">
							<Link href={`./${c.id}`} className="text-indigo-600 text-sm">View</Link>
							<Link href={`./${c.id}/edit`} className="text-gray-600 text-sm">Edit</Link>
						</div>
					</li>
				))}
			</ul>
		</main>
	)
}

