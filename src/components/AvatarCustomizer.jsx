import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

function AvatarCustomizer() {
  const { hero, setHero } = useContext(AuthContext);
  const [form, setForm] = useState(hero.avatar || {
    class: "Warrior",
    hairColor: "Black",
    weapon: "Sword"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAvatar = async () => {
    try {
      const res = await api.put(`/auth/avatar`, { avatar: form });
      setHero(res.data.hero);
      localStorage.setItem("hero", JSON.stringify(res.data.hero));
      alert("Avatar saved!");
    } catch (err) {
      alert("Failed to save avatar.");
    }
  };

  return (
    <div>
      <h2>🎨 Customize Your Avatar</h2>

      <label>
        Class:
        <select name="class" value={form.class} onChange={handleChange}>
          <option>Warrior</option>
          <option>Mage</option>
          <option>Ranger</option>
        </select>
      </label>

      <br />

      <label>
        Hair Color:
        <select name="hairColor" value={form.hairColor} onChange={handleChange}>
          <option>Black</option>
          <option>Blonde</option>
          <option>Red</option>
          <option>White</option>
        </select>
      </label>

      <br />

      <label>
        Weapon:
        <select name="weapon" value={form.weapon} onChange={handleChange}>
          <option>Sword</option>
          <option>Staff</option>
          <option>Bow</option>
        </select>
      </label>

      <br />

      <button onClick={saveAvatar}>💾 Save Avatar</button>

      <p>
        Preview: {form.hairColor} {form.class} with a {form.weapon}
      </p>
    </div>
  );
}

export default AvatarCustomizer;
