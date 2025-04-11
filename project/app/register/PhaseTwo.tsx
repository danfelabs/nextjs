"use client"

interface Props {
  data: any;
  onChange: (name: string, value: string) => void;
  next: () => void;
  back: () => void;
}

export default function PhaseTwo({ data, onChange, next, back }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Phase 2: Serial Number</h2>
      <input type="text" placeholder="Serial Number" value={data.serial} onChange={e => onChange("serial", e.target.value)} className="w-full border p-2 rounded" />
      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 border rounded">Back</button>
        <button onClick={next} className="bg-red-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}