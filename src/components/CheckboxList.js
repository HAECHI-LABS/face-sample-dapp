import Checkbox from './Checkbox';

function CheckboxList({ items, state, setState }) {
  const handleCheck = (checked, item) => {
    setState(checked ? [...state, item] : state.filter((value) => value !== item));
  };

  return (
    <table>
      <tbody>
        {items.map(({ key, label }) => (
          <tr key={key} onClick={() => handleCheck(!state.includes(key), key)}>
            <td>{label ? label : key}</td>
            <td>
              <Checkbox item={key} checked={state.includes(key)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CheckboxList;
