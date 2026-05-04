import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const routeOptions = [
  { id: '48Z', name: 'Meenambalpuram to Thirumangalam', baseFare: 10 },
  { id: '48AB', name: 'Thirumangalam to Iyer Bunglow', baseFare: 12 },
  { id: '48AB/1', name: 'Thirumangalam to Krishnanagar', baseFare: 15 },
  { id: '48AC', name: 'Oomachikulam to Thirumangalam', baseFare: 18 },
  { id: '48AX', name: 'Thirumangalam to Anna Bs', baseFare: 12 },
  { id: '48P.M', name: 'Periar to Maittanpatti', baseFare: 8 },
  { id: '48PP', name: 'Periar to Pasumalai', baseFare: 10 },
  { id: '48SV/1', name: 'Periar to Thoombakulam', baseFare: 12 },
  { id: '48ZA', name: 'Meenambalpuram to Thirumangalam', baseFare: 10 },
  { id: '48ZS', name: 'Meenambalpuram to Santhankudi', baseFare: 15 },
  { id: '50', name: 'Thirumangalam to Anupanadi', baseFare: 12 },
  { id: 'A1M', name: 'Krishnapuram Colony to Nilayur', baseFare: 10 },
  { id: 'B1M', name: 'Krishnapuram Colony to Nilayur', baseFare: 10 },
  { id: 'A1D', name: 'Thirunagar 3rd Stop to Krishnapuram Colony', baseFare: 8 },
  { id: '1B', name: 'Periar to Thapal Thanthi Nagar', baseFare: 8 },
  { id: '1E', name: 'Ellis Nagar to Thapal Thanthi Nagar', baseFare: 8 },
  { id: '1G', name: 'Balaji Nagar(Tpk) to Thapal Thanthi Nagar', baseFare: 10 },
  { id: '1P', name: 'Thapal Thanthi Nagar to Virattipathu', baseFare: 10 },
  { id: '2A', name: 'Periar to Pudhur', baseFare: 12 },
  { id: '2AD', name: 'Periar to Dr0 Colony', baseFare: 10 },
  { id: '2C', name: 'Periar to Pudhur', baseFare: 12 },
  { id: '2E', name: 'Ellis Nagar to Pudhur', baseFare: 10 },
  { id: '2G', name: 'Mattuthavani to Periar', baseFare: 8 },
  { id: '2GS', name: 'Periar to Surveyor Colony', baseFare: 10 },
  { id: '2K', name: 'Periar to Kathakinaru', baseFare: 15 },
  { id: '3', name: 'Palanganatham to Mattuthavani', baseFare: 8 },
  { id: '3A', name: 'Periar to Mattuthavani', baseFare: 8 },
  { id: '3AB', name: 'Periar to Anna Bs', baseFare: 10 },
  { id: '3C', name: 'Periar to Mattuthavani/Valar Nagar', baseFare: 10 },
  { id: '3D', name: 'Palanganatham to Narasingam', baseFare: 12 },
  { id: '3G', name: 'Periar Nilayam to Valar Nagar', baseFare: 10 },
  { id: '3K', name: 'Palanganatham to Othakadai', baseFare: 12 },
  { id: '3M', name: 'Palanganatham to Melur', baseFare: 25 },
  { id: '3MH', name: 'Palanganatham to High Court', baseFare: 10 },
  { id: '3T', name: 'Mattuthavani to Thirunagar', baseFare: 10 },
  { id: '4', name: 'Arapalayam to Viraganoor Ring Road', baseFare: 12 },
  { id: '4-1', name: 'Viraganoor Ring Road to Arapalayam', baseFare: 12 },
  { id: '4A', name: 'Periar to Anupanadi', baseFare: 10 },
  { id: '4D/1', name: 'Periar to Surya Nagar', baseFare: 10 },
  { id: '4DH', name: 'Periar to Meenakshi Amman Nagar', baseFare: 12 },
  { id: '4E', name: 'Periar to Iravathanallur', baseFare: 15 },
  { id: '4F', name: 'Periar to Madhaganai', baseFare: 12 },
  { id: '4G', name: 'Ellis Nagar to Anupanadi', baseFare: 10 },
  { id: '4H', name: 'Periar to Vandiyur', baseFare: 10 },
  { id: '4HA', name: 'Arapalayam to Vandiyur', baseFare: 12 },
  { id: '4K', name: 'Periar to Melaanupanadi', baseFare: 8 },
  { id: '4M', name: 'Anupanadi to Virattipathu', baseFare: 10 },
  { id: '4P', name: 'Periar to Panayur', baseFare: 15 },
  { id: '4S', name: 'Silaiman to Periar', baseFare: 10 },
  { id: '6B', name: 'Anupanadi to Meenambalpuram', baseFare: 10 },
  { id: '7', name: 'Arapalayam to Palanganatham', baseFare: 12 },
  { id: '7F', name: 'Mattuthavani to Harveypatti', baseFare: 15 },
  { id: '7PA', name: 'Arapalayam to Periar', baseFare: 8 },
  { id: '8', name: 'Anupanadi to Anaiyur', baseFare: 12 },
  { id: '8AV', name: 'Periar to Vaigai Vadakarai', baseFare: 10 },
  { id: '8B', name: 'Anupanadi to Koodal Nagar-Jj Pudhur', baseFare: 15 },
  { id: '8B/1', name: 'Arapalayam to Melaanupanadi', baseFare: 10 },
  { id: 'A9D', name: 'Tirunagar 3rd Stop to Krishnapuram Colony', baseFare: 8 },
  { id: '10', name: 'Periar to Avaniapuram', baseFare: 15 },
  { id: '10A', name: 'Periar to Airport', baseFare: 20 },
  { id: '10BB', name: 'Parambupatti to Periar', baseFare: 12 },
  { id: '10D', name: 'Arapalayam to Avaniapuram', baseFare: 15 },
  { id: '10H', name: 'Thiruparakundram to Periar', baseFare: 12 },
  { id: '10J', name: 'Arapalayam to Airport', baseFare: 20 },
  { id: '10L', name: 'Periar to Pokkuvarathu Nagar', baseFare: 15 },
  { id: '10LA', name: 'Arapalayam to Pokkuvarathu Nagar', baseFare: 15 },
  { id: '10R', name: 'Periar to Mandela Nagar', baseFare: 12 },
  { id: '11B', name: 'Periar to Mahatma Gandhi Nagar', baseFare: 10 },
  { id: '11E', name: 'Periar to Mahatma Gandhi Nagar', baseFare: 10 },
  { id: '12E', name: 'Kochadai to Theppakulam', baseFare: 10 },
  { id: '12N', name: 'Mattuthavani to Kochadai/Thuvariman', baseFare: 10 },
  { id: '14D', name: 'Periar to Pamban Nagar', baseFare: 12 },
  { id: '14V', name: 'Thirunagar to Vandiyur', baseFare: 10 },
  { id: '15C', name: 'Periar to Keeladi', baseFare: 18 },
  { id: '15E', name: 'Periar to Akaramjothipuram', baseFare: 15 },
  { id: '15F', name: 'Periar to Mankudi', baseFare: 15 },
  { id: '15H', name: 'Periar to Ilandhaikulam', baseFare: 18 },
  { id: '15K', name: 'Periar to Kalakarakadai', baseFare: 12 },
  { id: '15V', name: 'Periar to Varichiyur', baseFare: 15 },
  { id: '17A', name: 'Periar to Koodal Nagar', baseFare: 10 },
  { id: '17C', name: 'Periar to Vilangudi', baseFare: 12 },
  { id: '17F', name: 'Periar to Sathya Moorthi Nagar', baseFare: 12 },
  { id: '17K', name: 'Periar to Kallanai', baseFare: 18 },
  { id: '17M', name: 'Periar to Keelanedunkulam', baseFare: 15 },
  { id: '18', name: 'Periar to Thirupuvanam', baseFare: 20 },
  { id: '19A', name: 'Mattuthavani to Madakulam/Palanganatham', baseFare: 8 },
  { id: '19M', name: 'Mattuthavani to Alagiri Nagar', baseFare: 10 },
  { id: '20', name: 'Periar to Othakadai', baseFare: 12 },
  { id: '20A', name: 'Periar to Oomachikulam', baseFare: 15 },
  { id: '20BM', name: 'Periar to Mangalakudi', baseFare: 18 },
  { id: '21A', name: 'Periar to V.N College', baseFare: 12 },
  { id: '21B', name: 'Periar to Vadivelkarai', baseFare: 15 },
  { id: '21C', name: 'Periar to Viratipathu', baseFare: 10 },
  { id: '21D', name: 'Periar to Kamaraj University', baseFare: 15 },
  { id: '21H', name: 'Periar to Meenakshipatti', baseFare: 18 },
  { id: '21P', name: 'Anupanadi to University', baseFare: 15 },
  { id: '21M', name: 'Mattuthavani to Virattipathu', baseFare: 10 },
  { id: '21N', name: 'Periar to Nagamalaiputhukottai', baseFare: 18 },
  { id: '21R', name: 'Periar to Kazhungupatti', baseFare: 20 },
  { id: '21R/1', name: 'Anupanadi to Kazhungupatti', baseFare: 18 },
  { id: '21U', name: 'Periar to Oothupatti', baseFare: 15 },
  { id: '21V', name: 'Therkuvasal to Virattipathu', baseFare: 10 },
  { id: '22A', name: 'Tirunagar to Pudhur', baseFare: 12 },
  { id: '22', name: 'Tirunagar to Thapal Thanthi Nagar', baseFare: 10 },
  { id: '22J', name: 'Tirunagar to Arapalayam', baseFare: 12 },
  { id: '22P', name: 'Tirunagar to Periar', baseFare: 10 },
  { id: '22V', name: 'Thirunagar to Thapal Thanthi Nagar', baseFare: 10 },
  { id: '23A', name: 'Periar to Alanganallur', baseFare: 25 },
  { id: '23B', name: 'Periar to Poolampatti', baseFare: 30 },
  { id: '23F', name: 'Periar to Alanganallur', baseFare: 25 },
  { id: '23G', name: 'Periar to Thirupalai', baseFare: 20 },
  { id: '23GA', name: 'Arapalayam to Thirupalai', baseFare: 18 },
  { id: '23J', name: 'Periar to Jawaharpuram', baseFare: 25 },
  { id: '23K', name: 'Periar to Manjampatti', baseFare: 30 },
  { id: '23L', name: 'Periar to Kodimangalam', baseFare: 25 },
  { id: '23N', name: 'Periar to Alagarkovil', baseFare: 35 },
  { id: '23P', name: 'Periar to Lingavadi', baseFare: 30 },
  { id: '23P/1', name: 'Periar to Reddiyapatti', baseFare: 28 },
  { id: '23PM', name: 'Periar to Malaipatti', baseFare: 25 },
  { id: '23Q', name: 'Periar to Balamedu', baseFare: 25 },
  { id: '23R', name: 'Periar to Thopulanpatti', baseFare: 30 },
  { id: '23T', name: 'Periar to Thethampatti', baseFare: 28 },
  { id: '23U', name: 'Periar to Kannanendhal', baseFare: 25 },
  { id: '23W', name: 'Periar to Koolapandi', baseFare: 22 },
  { id: '23W/1', name: 'Periar to Maranivariyendhal', baseFare: 24 },
  { id: '23UA', name: 'Alagappan Nagar to Kannanendhal', baseFare: 12 },
  { id: '23V', name: 'Periar to Ayyanarpuram', baseFare: 22 },
  { id: '23Z', name: 'Periar to Paralipudhur', baseFare: 25 },
  { id: '23AT', name: 'Thirupalai to Alagappanagar', baseFare: 15 },
  { id: '23AU', name: 'Oomachikulam to Alagappanagar', baseFare: 12 },
  { id: '23ET', name: 'Ellisnagar to Thondamaanpatti', baseFare: 18 },
  { id: '24D', name: 'Periar to Aritapatti', baseFare: 30 },
  { id: '24G', name: 'Periar to Marudhur', baseFare: 25 },
  { id: '24K', name: 'Periar to Tvs Srichakra Tyres', baseFare: 15 },
  { id: '24P', name: 'Periar to Mankulam/Porusupatti', baseFare: 25 },
  { id: '24PP', name: 'Periar to Mankulam', baseFare: 22 },
  { id: '24R', name: 'Periar to Gandhi Nagar', baseFare: 12 },
  { id: '24M', name: 'Periar to Meenakshipuram', baseFare: 20 },
  { id: '25', name: 'Periar to Kulamangalam', baseFare: 20 },
  { id: '25E', name: 'Periar to Melaperumalpatti', baseFare: 25 },
  { id: '26Cut', name: 'Periar to Melakkal Kallar Palli', baseFare: 35 },
  { id: '26A', name: 'Periar to Kosavapatti', baseFare: 25 },
  { id: '26C', name: 'Periar to Nariampatti', baseFare: 30 },
  { id: '26C/1', name: 'Periar to Kachirairuppu', baseFare: 28 },
  { id: '26H', name: 'Periar to Tharapatti', baseFare: 30 },
  { id: '26H/1', name: 'Periar to Kamatchipuram', baseFare: 28 },
  { id: '26J', name: 'Periar to Theppathupatti-Eravarpatti', baseFare: 35 },
  { id: '26K', name: 'Mattuthavani to Vikramangalam', baseFare: 25 },
  { id: '26M', name: 'Periar to Eluvampatti', baseFare: 30 },
  { id: '26N', name: 'Periar to Paanamoopanpatti', baseFare: 28 },
  { id: '26R', name: 'Mattuthavani to Tharapatti', baseFare: 30 },
  { id: '26T', name: 'Periar to K.Perumalpatti', baseFare: 32 },
  { id: '29', name: 'Periar to Thenur', baseFare: 20 },
  { id: '29A', name: 'Periar to Sholavandhan', baseFare: 18 },
  { id: '29C', name: 'Periar to Oomachikulam', baseFare: 15 },
  { id: '29C/1', name: 'Periar to Samayanallur', baseFare: 18 },
  { id: '29E', name: 'Periar to Paravai', baseFare: 20 },
  { id: '29F', name: 'Mattuthavani to Vilankudi', baseFare: 15 },
  { id: '29G', name: 'Sholavandhan to Viraganoor Ring Road', baseFare: 20 },
  { id: '29K', name: 'Periar to Karupatti', baseFare: 15 },
  { id: '29T', name: 'Thiruparankundram to Oomachikulam', baseFare: 15 },
  { id: '30A', name: 'Periar to Vairavanatham', baseFare: 12 },
  { id: '30B', name: 'Periar to Vairanatham', baseFare: 12 },
  { id: '30B/1', name: 'Periar to Vayalur', baseFare: 18 },
  { id: '30D', name: 'Periar to Moolakurichi', baseFare: 20 },
  { id: '32', name: 'Periar to Papakudi', baseFare: 25 },
  { id: '32/1', name: 'Periar to Ladanendhal', baseFare: 28 },
  { id: '32/2', name: 'Periar to Sokkanathairuppu', baseFare: 30 },
  { id: '32A', name: 'Periar to Panayanendhal', baseFare: 22 },
  { id: '32AM', name: 'Periar to Mudhuvanthidal', baseFare: 25 },
  { id: '32B', name: 'Periar to Thirupuvanam Pudhur', baseFare: 22 },
  { id: '32BP', name: 'Periar to Thirupuvanam', baseFare: 20 },
  { id: '32C', name: 'Periar to Nainarpettai', baseFare: 18 },
  { id: '32D', name: 'Periar to Allinagaram', baseFare: 20 },
  { id: '32FM', name: 'Mattuthavani(?) to Melachorikulam', baseFare: 15 },
  { id: '32G', name: 'Periar to Angadimangalam', baseFare: 22 },
  { id: '32H', name: 'Periar to Kothankulam', baseFare: 25 },
  { id: '32HA', name: 'Arapalayam to Kothankulam', baseFare: 22 },
  { id: '32J', name: 'Periar to Palayanur', baseFare: 28 },
  { id: '32K', name: 'Periar to Keelarangiyam', baseFare: 25 },
  { id: '32KP', name: 'Periar to Koodathupatti', baseFare: 30 },
  { id: '32L', name: 'Periar to Pullvaikarai', baseFare: 25 },
  { id: '32M', name: 'Periar to Sokkanathairuppu', baseFare: 30 },
  { id: '32N', name: 'Periar to Kanakankudi', baseFare: 28 },
  { id: '32P', name: 'Periar to Eenadhi', baseFare: 22 },
  { id: '32P/1', name: 'Periar to Papakudi', baseFare: 25 },
  { id: '32Q', name: 'Periar to Kannayiruppu', baseFare: 25 },
  { id: '32R', name: 'Periar to Piramanur', baseFare: 30 },
  { id: '32S', name: 'Periar to Manalmedu', baseFare: 28 },
  { id: '32T', name: 'Periar to Madapuram', baseFare: 25 },
  { id: '32U', name: 'Periar to Rettaikulam', baseFare: 28 },
  { id: '32V', name: 'Periar to Vayalseri', baseFare: 30 },
  { id: '32W', name: 'Periar to V.Karisalkulam', baseFare: 25 },
  { id: '32X', name: 'Periar to Kannur Vilakku', baseFare: 28 },
  { id: '32Y', name: 'Periar to Avarankulam', baseFare: 25 },
  { id: '32VT', name: 'Periar to Thachanendhal', baseFare: 30 },
  { id: '32Z', name: 'Periar to Undurumi Kidakulam', baseFare: 32 },
  { id: '32Z/1', name: 'Periar to A.Mukkulam', baseFare: 30 },
  { id: '37B', name: 'Periar to Thirumangalam', baseFare: 20 },
  { id: '39B', name: 'Periar to Arasankulam', baseFare: 22 },
  { id: '39D', name: 'Periar to Mangulam', baseFare: 25 },
  { id: '40D', name: 'Periar to Kinnimangalam', baseFare: 25 },
  { id: '40E', name: 'Periar to Karisalpatti', baseFare: 28 },
  { id: '40F', name: 'Periar to Kasbhamuthalaikulam', baseFare: 30 },
  { id: '40P', name: 'Periar to Pappapatti', baseFare: 25 },
  { id: '40PC', name: 'Periar to Sekkanoorani', baseFare: 28 },
  { id: '40T', name: 'Periar to Thirumangalam', baseFare: 20 },
  { id: '41', name: 'Periar to Samathuvapuram', baseFare: 22 },
  { id: '41/1', name: 'Periar to Kutladampatti', baseFare: 25 },
  { id: '41C', name: 'Periar to Kutladampatti', baseFare: 25 },
  { id: '42', name: 'Periar to Idayapatti', baseFare: 25 },
  { id: '42/1', name: 'Periar to Poovandhi', baseFare: 28 },
  { id: '42A', name: 'Periar to Kalimangalam', baseFare: 30 },
  { id: '42C', name: 'Periar to Ilamanoor', baseFare: 28 },
  { id: '42F', name: 'Periar to Ambedkhar Nagar', baseFare: 25 },
  { id: '42J', name: 'Periar to Poonchuthi', baseFare: 22 },
  { id: '42H', name: 'Periar to Idayapatti', baseFare: 25 },
  { id: '42L', name: 'Periar to Sakkimangalam', baseFare: 28 },
  { id: '42M', name: 'Periar to Aandarkottaram', baseFare: 30 },
  { id: '42N', name: 'Periar to Dr.Kabeernagar', baseFare: 25 },
  { id: '42P', name: 'Periar to Padamathur', baseFare: 28 },
  { id: '42S', name: 'Periar to Thirumoghur', baseFare: 22 },
  { id: '42T', name: 'Periar to Thindiyur', baseFare: 25 },
  { id: '42V', name: 'Periar to Vellankulam', baseFare: 28 },
  { id: '42X', name: 'Periar to Thirumancholai', baseFare: 25 },
  { id: '43B', name: 'Periar to Siruvalai', baseFare: 30 },
  { id: '43DD', name: 'Palanganatham to Kallanai', baseFare: 15 },
  { id: '43E', name: 'Palanganatham to Kulamangalam', baseFare: 12 },
  { id: '43F', name: 'Periar to Thandalai', baseFare: 28 },
  { id: '43H', name: 'Periar to Kovilpapakudi', baseFare: 30 },
  { id: '43K', name: 'Periar to Vavidamarudhur', baseFare: 32 },
  { id: '43N', name: 'Periar to Sellanagoundanpatti', baseFare: 30 },
  { id: '44', name: 'Periar to Alagarkovil', baseFare: 35 },
  { id: '44A', name: 'Periar to Kidaripatti', baseFare: 30 },
  { id: '44B', name: 'Periar to Alagarkovil', baseFare: 35 },
  { id: '44C', name: 'Periar to Mathur', baseFare: 28 },
  { id: '44D', name: 'Periar to A. Vellala Patti', baseFare: 30 },
  { id: '44E', name: 'Periar to Appanthirupathi', baseFare: 32 },
  { id: '44G', name: 'Periar to Kodikulam', baseFare: 30 },
  { id: '44GA', name: 'Periar to Arumbanur', baseFare: 25 },
  { id: '44GX', name: 'Arumbanur to Kochadai', baseFare: 15 },
  { id: '44K', name: 'Periar to Kuruthur', baseFare: 28 },
  { id: '44N', name: 'Periar to Nayakanpatti', baseFare: 30 },
  { id: '44P', name: 'Periar to Pilluseri', baseFare: 32 },
  { id: '44R', name: 'Periar to Sathirapatti', baseFare: 28 },
  { id: '44RK', name: 'Periar to Kallandhiri', baseFare: 30 },
  { id: '44T', name: 'Thiruparankundram to Alagarkovil', baseFare: 30 },
  { id: '44V', name: 'Periar to Maraikayarpuram', baseFare: 25 },
  { id: '47', name: 'Periar to Nedunkulam', baseFare: 22 },
  { id: '47/1', name: 'Periar to Melakallakulam', baseFare: 25 },
  { id: '47A', name: 'Periar to Kancharankulam', baseFare: 20 },
  { id: '47G', name: 'Periar to Settathatti', baseFare: 22 },
  { id: '47K', name: 'Periar to Kusavapatti', baseFare: 25 },
  { id: '47L', name: 'Periar to Vadukankulam', baseFare: 28 },
  { id: '47N', name: 'Periar to Nallur', baseFare: 18 },
  { id: '47NA', name: 'Arapalayam to Nallur', baseFare: 15 },
  { id: '47T', name: 'Arapalayam to Kattabommankottai', baseFare: 20 },
  { id: '47TA', name: 'Periar to Kattamankottai', baseFare: 22 },
  { id: '51', name: 'Periar to Balamedu', baseFare: 25 },
  { id: '52', name: 'Periar to Austinpatti', baseFare: 28 },
  { id: '54B', name: 'Periar to Nedunkulam', baseFare: 22 },
  { id: '54C', name: 'Periar to Melanachikulam', baseFare: 25 },
  { id: '54Cut', name: 'Periar to Sholavandhan', baseFare: 18 },
  { id: '54R', name: 'Periar to Ramarajapuram', baseFare: 30 },
  { id: '55A', name: 'Periar to Uchapatti', baseFare: 25 },
  { id: '55C', name: 'Periar to Munduvelampatti', baseFare: 28 },
  { id: '55E', name: 'Periar to Vaakaikulam', baseFare: 30 },
  { id: '55F', name: 'Periar to Nattampatti Hospital', baseFare: 25 },
  { id: '55G', name: 'Periar to Aampattaimpatti', baseFare: 28 },
  { id: '55M', name: 'Mattuthavani to Sellampatti', baseFare: 20 },
  { id: '55H', name: 'Periar to Thalayoothupatti', baseFare: 30 },
  { id: '55L', name: 'Periar to Vaalandhur', baseFare: 25 },
  { id: '55N', name: 'Periar to Kuravakudi', baseFare: 28 },
  { id: '55P', name: 'Periar to Pappapatti', baseFare: 25 },
  { id: '55U', name: 'Periar to Usilampatti', baseFare: 30 },
  { id: '56', name: 'Periar to Kaluvankulam', baseFare: 22 },
  { id: '56/1', name: 'Periar to Sari Pudhukottai', baseFare: 25 },
  { id: '56Cut', name: 'Periar to Kuthiraikuthi/Kusavakundu', baseFare: 20 },
  { id: '56A', name: 'Periar to Nallur', baseFare: 18 },
  { id: '56K', name: 'Periar to Kanchirankulam', baseFare: 20 },
  { id: '57', name: 'Periar to Balamedu', baseFare: 25 },
  { id: '57C', name: 'Periar to Saranthangi', baseFare: 28 },
  { id: '57E', name: 'Periar to Valayapatti', baseFare: 30 },
  { id: '57M', name: 'Periar to Sellampatti', baseFare: 25 },
  { id: '57U', name: 'Periar to Vellayampatti', baseFare: 28 },
  { id: '57V', name: 'Periar to Vellayampatti', baseFare: 28 },
  { id: '59', name: 'Periar to Velliyampatti', baseFare: 25 },
  { id: '59B', name: 'Periar to Senthamangalam', baseFare: 28 },
  { id: '59C', name: 'Periar to Saranthangi', baseFare: 28 },
  { id: '59D', name: 'Periar to Mooduvarpatti', baseFare: 30 },
  { id: '60', name: 'Periar to Kuravankulam', baseFare: 22 },
  { id: '60A', name: 'Periar to A.Kovilpatti', baseFare: 25 },
  { id: '60A/1', name: 'Periar to Errampatti', baseFare: 28 },
  { id: '60B', name: 'Periar to A.Kovilpatti', baseFare: 25 },
  { id: '60C', name: 'Periar to Vaikasipatti', baseFare: 28 },
  { id: '60D', name: 'Periar to Keelachinnampatti', baseFare: 30 },
  { id: '61A', name: 'Periar to Keelapatti', baseFare: 25 },
  { id: '61K', name: 'Periar to Kalungupatti', baseFare: 28 },
  { id: '62A', name: 'Periar to Sinnakasampatti', baseFare: 30 },
  { id: '62B', name: 'Periar to Natham', baseFare: 35 },
  { id: '62P', name: 'Periar to Natham-Serveedu', baseFare: 38 },
  { id: '63', name: 'Periar to Karupatti', baseFare: 15 },
  { id: '64', name: 'Periar to Panniyaan', baseFare: 20 },
  { id: '64A', name: 'Periar to Mayakarumbanpatti', baseFare: 22 },
  { id: '65', name: 'Periar to Kadupatti', baseFare: 20 },
  { id: '65A', name: 'Periar to Vikramangalam', baseFare: 25 },
  { id: '65B', name: 'Periar to Vadakadupatti', baseFare: 22 },
  { id: '66', name: 'Periar to Thiruvathavur', baseFare: 20 },
  { id: '66Cut', name: 'Periar to Ilanthaikulam', baseFare: 18 },
  { id: '66B', name: 'Periar to Kottakudi', baseFare: 25 },
  { id: '66C', name: 'Periar to Kattaiyampatti', baseFare: 28 },
  { id: '66E', name: 'Periar to Thirumoghur', baseFare: 22 },
  { id: '66F', name: 'Periar to Thirukkanai', baseFare: 25 },
  { id: '66H', name: 'Periar to Eluvakarayanpatti', baseFare: 30 },
  { id: '66P', name: 'Periar to Mettupatti', baseFare: 25 },
  { id: '66S', name: 'Periar to Mukkampatti', baseFare: 28 },
  { id: '66X', name: 'Periar to Ilangipatti', baseFare: 25 },
  { id: '67', name: 'Periar to Kondayampatti', baseFare: 22 },
  { id: '67/1', name: 'Periar to Thandayampatti', baseFare: 25 },
  { id: '67K', name: 'Periar to Maravapatti', baseFare: 28 },
  { id: '68', name: 'Periar to Kuruvithurai', baseFare: 30 },
  { id: '68Cut', name: 'Periar to Mannadimangalam', baseFare: 25 },
  { id: '68A', name: 'Periar to Dhamodharanpatti', baseFare: 28 },
  { id: '69A', name: 'Periar to Kondaiyampatti', baseFare: 22 },
  { id: '69Cut', name: 'Periar to Kalvelipatti', baseFare: 20 },
  { id: '71', name: 'Periar to Vadipatti', baseFare: 20 },
  { id: '72', name: 'Periar to Melauppilikundu', baseFare: 22 },
  { id: '72A', name: 'Periar to Nedumadurai', baseFare: 25 },
  { id: '72D', name: 'Periar to Kallanai', baseFare: 18 },
  { id: '73', name: 'Mattuthavani to Palanganatham', baseFare: 8 },
  { id: '73/1', name: 'Palanganatham to Annanagar', baseFare: 10 },
  { id: '73A', name: 'Palanganatham to Karupayurani', baseFare: 12 },
  { id: '73M', name: 'Palanganatham to Mattuthavani', baseFare: 8 },
  { id: '74', name: 'Periar to Kodangipatti', baseFare: 30 },
  { id: '75', name: 'Periar to Melur', baseFare: 30 },
  { id: '75D', name: 'Tirunagar to Melur', baseFare: 28 },
  { id: '75PP', name: 'Periar to Pappakudipatti', baseFare: 28 },
  { id: '75T', name: 'Periar to Thaniamangalam', baseFare: 30 },
  { id: '75V', name: 'Periar to Uranganpatti', baseFare: 32 },
  { id: '75V/1', name: 'Periar to Pulipatti', baseFare: 30 },
  { id: '75E', name: 'Periar to Thumbaipatti', baseFare: 35 },
  { id: '76', name: 'Periar to Kariapatti', baseFare: 35 },
  { id: '76C', name: 'Periar to K.Karisalkulam', baseFare: 32 },
  { id: '76D', name: 'Periar to D.Kadambakulam', baseFare: 30 },
  { id: '76F', name: 'Periar to Ilupankulam', baseFare: 35 },
  { id: '76G', name: 'Periar to Allikulam', baseFare: 32 },
  { id: '76K', name: 'Periar to Kallakurichi', baseFare: 38 },
  { id: '76L', name: 'Periar to Sithumoondradaippu', baseFare: 35 },
  { id: '76N', name: 'Periar to Pallavaranendhal', baseFare: 32 },
  { id: '76P', name: 'Periar to Pambapatti', baseFare: 35 },
  { id: '76T', name: 'Periar to Thimmampuram', baseFare: 38 },
  { id: '80', name: 'Periar to Sakudi', baseFare: 20 },
  { id: '80A', name: 'Periar to Athikarai', baseFare: 25 },
  { id: '86', name: 'Periar to T.Kokkulam', baseFare: 22 },
  { id: '86/1', name: 'Periar to T.Pudhupatti', baseFare: 25 },
  { id: '87A', name: 'Periar to Arasanur', baseFare: 20 },
  { id: '91', name: 'Periar to Kaliyandhu', baseFare: 18 },
  { id: '91/1', name: 'Periar to Keelavellur', baseFare: 20 },
  { id: '91A', name: 'Periar to Mangudi', baseFare: 22 },
  { id: '91B', name: 'Periar to Keelavellur', baseFare: 20 },
  { id: '94B', name: 'Periar to Keelavellur', baseFare: 20 },
  { id: '95A', name: 'Periar to T.Mettupatti', baseFare: 25 },
  { id: '97', name: 'Periar to Poompidakai', baseFare: 18 },
  { id: '99', name: 'Periar to Marnaadu', baseFare: 15 },
  { id: '99C', name: 'Periar to Marnaadu Outer', baseFare: 18 },
  { id: '99G', name: 'Periar to Kallurani', baseFare: 20 },
  { id: '99H', name: 'Periar to Vakudi', baseFare: 18 },
  { id: '99K', name: 'Periar to Killikudi', baseFare: 22 },
  { id: '99L', name: 'Periar to Vilathur', baseFare: 20 },
  { id: '99M/1', name: 'Periar to Idaikatur', baseFare: 25 },
  { id: '99N', name: 'Periar to Kaanurvilakku', baseFare: 22 },
  { id: '99S', name: 'Periar to Sullankudi', baseFare: 20 },
  { id: '99V', name: 'Periar to Vempathur', baseFare: 25 },
  { id: '99X', name: 'Periar to Malavarayanendhal', baseFare: 22 },
  { id: '230', name: 'Periar to Balamedu', baseFare: 25 },
  { id: '700', name: 'Periar to Mattuthavani', baseFare: 8 },
  { id: '700/1', name: 'Vasantha Nagar to Mattuthavani', baseFare: 8 },
  { id: '700A', name: 'Periar to High Court', baseFare: 10 },
  { id: '700E', name: 'Ellis Nagar to Mattuthavani', baseFare: 8 },
  { id: '701', name: 'Mattuthavani to Periar', baseFare: 8 },
  { id: '701A', name: 'Periar to High Court', baseFare: 10 },
  { id: '5AN', name: 'Thiruparankundram to Annanagar', baseFare: 12 },
  { id: '5AA', name: 'Thenpalanji to Mattuthavani', baseFare: 10 },
  { id: '5DD', name: 'Karuvelampatti to Mattuthavani', baseFare: 12 },
  { id: '5EE', name: 'Periar Nilayam to Sambakulam', baseFare: 10 },
  { id: '5K', name: 'Kappalur Colony to Mattuthavani', baseFare: 15 },
  { id: '5P', name: 'Thiruvalluvar Nagar to Mattuthavani', baseFare: 10 },
  { id: '5PV', name: 'Thiruvalluvar Nagar to Pudhur', baseFare: 12 },
  { id: '5PV/1', name: 'Vengalamoorthy Nagar to Pudhur', baseFare: 10 },
  { id: '5T', name: 'Mattuthavani to Thoppur', baseFare: 15 },
  { id: 'N4C', name: 'Arapalayam to Mattuthavani', baseFare: 10 },
  { id: 'C2', name: 'Arapalayam to Arapalayam', baseFare: 5 },
  { id: 'C3', name: 'Mattuthavani to Mattuthavani', baseFare: 5 },
  { id: 'C4', name: 'Mattuthavani to Mattuthavani', baseFare: 5 },
  { id: 'C5', name: 'Periar to Periar', baseFare: 5 },
  { id: 'C6', name: 'Periar to Periar', baseFare: 5 },
  { id: 'C7', name: 'Periar to Periar', baseFare: 5 },
  { id: 'C8', name: 'Periar to Periar', baseFare: 5 },
  { id: 'C9', name: 'Thiruparankundram to Thiruparankundram', baseFare: 5 },
  { id: 'C10', name: 'Thiruparankundram to Thiruparankundram', baseFare: 5 },
  { id: 'C17', name: 'Periar to Periar', baseFare: 5 },
  { id: 'C18', name: 'Periar to Periar', baseFare: 5 }
]

function BusBooking() {
  const navigate = useNavigate()
  const [selectedRoute, setSelectedRoute] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [error, setError] = useState('')
  const [calculatedFare, setCalculatedFare] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRoutes = routeOptions.filter(route => 
    route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value)
    setError('')
    setCalculatedFare(null)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const calculateFare = () => {
    if (!selectedRoute) {
      setError('Please select a route')
      return
    }

    const route = routeOptions.find(r => r.id === selectedRoute)
    const baseFare = route.baseFare
    const passengerFare = baseFare * passengers
    const convenienceFee = Math.round(passengerFare * 0.02)
    const total = passengerFare + convenienceFee

    setCalculatedFare({
      baseFare,
      passengerFare,
      convenienceFee,
      total,
      routeName: route.name
    })
  }

  const handleProceedToPayment = () => {
    if (!calculatedFare) {
      calculateFare()
      return
    }

    const bookingData = {
      route: selectedRoute,
      routeName: calculatedFare.routeName,
      passengers,
      fare: calculatedFare,
      timestamp: new Date().toISOString()
    }

    sessionStorage.setItem('busBooking', JSON.stringify(bookingData))
    navigate('/bus-payment', { state: bookingData })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-deep to-indigo-dark p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🚌</div>
              <div>
                <h1 className="text-2xl font-bold">TNSTC Madurai</h1>
                <p className="opacity-90">Periar Bus Station</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Route / Bus Route Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search route (e.g., 48Z, Periar to Thirumangalam)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              <select
                value={selectedRoute}
                onChange={handleRouteChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select a route ({routeOptions.length} routes available)</option>
                {filteredRoutes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.id} - {route.name} (₹{route.baseFare})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">{filteredRoutes.length} routes match your search</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Number of Passengers
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-12 h-12 bg-gray-200 rounded-lg text-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{passengers}</span>
                <button
                  onClick={() => setPassengers(Math.min(10, passengers + 1))}
                  className="w-12 h-12 bg-gray-200 rounded-lg text-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Maximum 10 passengers per booking</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {calculatedFare && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Fare Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare (per passenger)</span>
                    <span className="font-medium">₹{calculatedFare.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{passengers} Passenger(s)</span>
                    <span className="font-medium">₹{calculatedFare.passengerFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience Fee (2%)</span>
                    <span className="font-medium">₹{calculatedFare.convenienceFee}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{calculatedFare.total}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={calculateFare}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Calculate Fare
              </button>
              <button
                onClick={handleProceedToPayment}
                className="flex-1 px-6 py-3 bg-indigo-base text-white rounded-lg font-semibold hover:bg-indigo-dark transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Payment
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Tickets are valid for single journey only</li>
            <li>• Show QR code to conductor when boarding</li>
            <li>• Cancellation not allowed after payment</li>
            <li>• For any assistance, contact TNSTC helpdesk</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BusBooking
