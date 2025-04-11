"use client"

interface Props {
  data: any;
  onChange: (name: string, value: string) => void;
  submit: () => void;
  back: () => void;
}

export default function PhaseThree({ data, onChange, submit, back }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Phase 3: Contact</h2>
      <input type="text" placeholder="Mobile Number" value={data.mobile} onChange={e => onChange("mobile", e.target.value)} className="w-full border p-2 rounded" />
      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 border rounded">Back</button>
        <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </div>
  );
}