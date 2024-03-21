import { Dropdown, Select } from 'flowbite-react';

export default function Home() {
  return (
    <div className='grid grid-cols-4 mx-3 my-3 gap-4 text-sm'>
      <div className='mt-2 text-right'>
        Platform:
      </div>
      <div>
        <Select id="category" required>
          <option>PC</option>
          <option>XBOX</option>
          <option>PlayStation</option>
          <option>Nintendo</option>
        </Select>
      </div>
      <div className='mt-2 text-right'>
        Filter:
      </div>
      <div>
        <Select id="sort" required>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Lowest Price</option>
          <option>Highest Price</option>
        </Select>
      </div>
    </div>
  );
}