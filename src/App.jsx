import { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";


import './App.css'

function App() {
  const aspek = [1, 2, 3, 4];
  const totalMahasiswa = 10;

  const [scores, setScores] = useState(
    Array(totalMahasiswa).fill(null).map(() => Array(aspek.length).fill(1))
  );
  const [copied, setCopied] = useState(false);

  const handleScoreChange = (studentIndex, aspekIndex, value) => {
    const newScores = scores.map((row, i) => {
      if (i === studentIndex) {
        const newRow = [...row];
        newRow[aspekIndex] = parseInt(value);
        return newRow;
      }
      return row;
    });
    setScores(newScores);
  };

  const handleSimpan = () => {
    const dataOutput = {
      timestamp: new Date().toISOString(),
    };

    aspek.forEach((num, aspekIndex) => {
      const aspekKey = `aspek_penilaian_${num}`;
      dataOutput[aspekKey] = {};
      scores.forEach((row, studentIndex) => {
        const mahasiswaKey = `mahasiswa_${studentIndex + 1}`;
        dataOutput[aspekKey][mahasiswaKey] = scores[studentIndex][aspekIndex];
      });
    });
      console.log(JSON.stringify(dataOutput, null, 2));
      alert('Data telah disimpan. Lihat output di bawah.');
  };

    const handleCopy = async () => {
      // build the same object as displayed and copy it
      const dataOutput = {
        timestamp: new Date().toISOString(),
      };
      aspek.forEach((num, aspekIndex) => {
        const aspekKey = `aspek_penilaian_${num}`;
        dataOutput[aspekKey] = {};
        scores.forEach((row, studentIndex) => {
          const mahasiswaKey = `mahasiswa_${studentIndex + 1}`;
          dataOutput[aspekKey][mahasiswaKey] = scores[studentIndex][aspekIndex];
        });
      });
      const pretty = JSON.stringify(dataOutput, null, 2);
      try {
        await navigator.clipboard.writeText(pretty);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        // fallback
        const el = document.createElement('textarea');
        el.value = pretty;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

  return (
    <div className="App">
      <div className="TableInput">
        <h1>Aplikasi Penilaian Mahasiswa</h1>

        <table className="student-table">
          <thead>
            <tr>
              <th></th>
              {aspek.map((num) => (
                <th key={num}>Aspek Penilaian {num}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array(totalMahasiswa).fill(null).map((_, studentIndex) => (
              <tr key={studentIndex}>
                <td><div className='student-avatar'><FaUserCircle size={20} className='user-avatar' />Mahasiswa {studentIndex + 1}</div> </td>
                {aspek.map((_, aspekIndex) => (
                  <td key={aspekIndex}>
                    <select 
                      value={scores[studentIndex][aspekIndex]} 
                      onChange={(e) => handleScoreChange(studentIndex, aspekIndex, e.target.value)}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

          <div className='action-btn'>
            <button onClick={handleSimpan} className="simpan-btn">Simpan</button>
          </div>
        
      </div>

      <div className='output-container'>
        <div className='output-header'>
          <h2>Output JSON</h2>
          <button className='copy-btn' onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <pre className='json-output'>
{JSON.stringify(
  {
    ...aspek.reduce((acc, num, aspekIndex) => {
      const aspekKey = `aspek_penilaian_${num}`;
      acc[aspekKey] = scores.reduce((mahasiswaAcc, row, studentIndex) => {
        const mahasiswaKey = `mahasiswa_${studentIndex + 1}`;
        mahasiswaAcc[mahasiswaKey] = scores[studentIndex][aspekIndex];
        return mahasiswaAcc;
      }, {});
      return acc;
    }, {})
  },
  null,
  2
)}
        </pre>
      </div>
    </div>
    
  );
}



export default App
