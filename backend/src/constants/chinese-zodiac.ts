import { stringToDate } from "@/utils/date.utils";

// Source: https://en.wikipedia.org/wiki/Chinese_zodiac
export const CHINESE_ZODIAC_SIGNS = [
    {
        "rangeDate": "Feb 05 1924-Jan 23 1925",
        "element": "Yang Wood",
        "animal": "Rat"
    },
    {
        "rangeDate": "Jan 24 1925-Feb 12 1926",
        "element": "Yin Wood",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 13 1926-Feb 01 1927",
        "element": "Yang Fire",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 02 1927-Jan 22 1928",
        "element": "Yin Fire",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Jan 23 1928-Feb 09 1929",
        "element": "Yang Earth",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 10 1929-Jan 29 1930",
        "element": "Yin Earth",
        "animal": "Snake"
    },
    {
        "rangeDate": "Jan 30 1930-Feb 16 1931",
        "element": "Yang Metal",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 17 1931-Feb 05 1932",
        "element": "Yin Metal",
        "animal": "Goat"
    },
    {
        "rangeDate": "Feb 06 1932-Jan 25 1933",
        "element": "Yang Water",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Jan 26 1933-Feb 13 1934",
        "element": "Yin Water",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 14 1934-Feb 03 1935",
        "element": "Yang Wood",
        "animal": "Dog"
    },
    {
        "rangeDate": "Feb 04 1935-Jan 23 1936",
        "element": "Yin Wood",
        "animal": "Pig"
    },
    {
        "rangeDate": "Jan 24 1936-Feb 10 1937",
        "element": "Yang Fire",
        "animal": "Rat"
    },
    {
        "rangeDate": "Feb 11 1937-Jan 30 1938",
        "element": "Yin Fire",
        "animal": "Ox"
    },
    {
        "rangeDate": "Jan 31 1938-Feb 18 1939",
        "element": "Yang Earth",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 19 1939-Feb 07 1940",
        "element": "Yin Earth",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Feb 08 1940-Jan 26 1941",
        "element": "Yang Metal",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Jan 27 1941-Feb 14 1942",
        "element": "Yin Metal",
        "animal": "Snake"
    },
    {
        "rangeDate": "Feb 15 1942-Feb 04 1943",
        "element": "Yang Water",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 05 1943-Jan 24 1944",
        "element": "Yin Water",
        "animal": "Goat"
    },
    {
        "rangeDate": "Jan 25 1944-Feb 12 1945",
        "element": "Yang Wood",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Feb 13 1945-Feb 01 1946",
        "element": "Yin Wood",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 02 1946-Jan 21 1947",
        "element": "Yang Fire",
        "animal": "Dog"
    },
    {
        "rangeDate": "Jan 22 1947-Feb 09 1948",
        "element": "Yin Fire",
        "animal": "Pig"
    },
    {
        "rangeDate": "Feb 10 1948-Jan 28 1949",
        "element": "Yang Earth",
        "animal": "Rat"
    },
    {
        "rangeDate": "Jan 29 1949-Feb 16 1950",
        "element": "Yin Earth",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 17 1950-Feb 05 1951",
        "element": "Yang Metal",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 06 1951-Jan 26 1952",
        "element": "Yin Metal",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Jan 27 1952-Feb 13 1953",
        "element": "Yang Water",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 14 1953-Feb 02 1954",
        "element": "Yin Water",
        "animal": "Snake"
    },
    {
        "rangeDate": "Feb 03 1954-Jan 23 1955",
        "element": "Yang Wood",
        "animal": "Horse"
    },
    {
        "rangeDate": "Jan 24 1955-Feb 11 1956",
        "element": "Yin Wood",
        "animal": "Goat"
    },
    {
        "rangeDate": "Feb 12 1956-Jan 30 1957",
        "element": "Yang Fire",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Jan 31 1957-Feb 17 1958",
        "element": "Yin Fire",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 18 1958-Feb 07 1959",
        "element": "Yang Earth",
        "animal": "Dog"
    },
    {
        "rangeDate": "Feb 08 1959-Jan 27 1960",
        "element": "Yin Earth",
        "animal": "Pig"
    },
    {
        "rangeDate": "Jan 28 1960-Feb 14 1961",
        "element": "Yang Metal",
        "animal": "Rat"
    },
    {
        "rangeDate": "Feb 15 1961-Feb 04 1962",
        "element": "Yin Metal",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 05 1962-Jan 24 1963",
        "element": "Yang Water",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Jan 25 1963-Feb 12 1964",
        "element": "Yin Water",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Feb 13 1964-Feb 01 1965",
        "element": "Yang Wood",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 02 1965-Jan 20 1966",
        "element": "Yin Wood",
        "animal": "Snake"
    },
    {
        "rangeDate": "Jan 21 1966-Feb 08 1967",
        "element": "Yang Fire",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 09 1967-Jan 29 1968",
        "element": "Yin Fire",
        "animal": "Goat"
    },
    {
        "rangeDate": "Jan 30 1968-Feb 16 1969",
        "element": "Yang Earth",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Feb 17 1969-Feb 05 1970",
        "element": "Yin Earth",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 06 1970-Jan 26 1971",
        "element": "Yang Metal",
        "animal": "Dog"
    },
    {
        "rangeDate": "Jan 27 1971-Feb 14 1972",
        "element": "Yin Metal",
        "animal": "Pig"
    },
    {
        "rangeDate": "Feb 15 1972-Feb 02 1973",
        "element": "Yang Water",
        "animal": "Rat"
    },
    {
        "rangeDate": "Feb 03 1973-Jan 22 1974",
        "element": "Yin Water",
        "animal": "Ox"
    },
    {
        "rangeDate": "Jan 23 1974-Feb 10 1975",
        "element": "Yang Wood",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 11 1975-Jan 30 1976",
        "element": "Yin Wood",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Jan 31 1976-Feb 17 1977",
        "element": "Yang Fire",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 18 1977-Feb 06 1978",
        "element": "Yin Fire",
        "animal": "Snake"
    },
    {
        "rangeDate": "Feb 07 1978-Jan 27 1979",
        "element": "Yang Earth",
        "animal": "Horse"
    },
    {
        "rangeDate": "Jan 28 1979-Feb 15 1980",
        "element": "Yin Earth",
        "animal": "Goat"
    },
    {
        "rangeDate": "Feb 16 1980-Feb 04 1981",
        "element": "Yang Metal",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Feb 05 1981-Jan 24 1982",
        "element": "Yin Metal",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Jan 25 1982-Feb 12 1983",
        "element": "Yang Water",
        "animal": "Dog"
    },
    {
        "rangeDate": "Feb 13 1983-Feb 01 1984",
        "element": "Yin Water",
        "animal": "Pig"
    },
    {
        "rangeDate": "Feb 02 1984-Feb 19 1985",
        "element": "Yang Wood",
        "animal": "Rat"
    },
    {
        "rangeDate": "Feb 20 1985-Feb 08 1986",
        "element": "Yin Wood",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 09 1986-Jan 28 1987",
        "element": "Yang Fire",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Jan 29 1987-Feb 16 1988",
        "element": "Yin Fire",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Feb 17 1988-Feb 05 1989",
        "element": "Yang Earth",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 06 1989-Jan 26 1990",
        "element": "Yin Earth",
        "animal": "Snake"
    },
    {
        "rangeDate": "Jan 27 1990-Feb 14 1991",
        "element": "Yang Metal",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 15 1991-Feb 03 1992",
        "element": "Yin Metal",
        "animal": "Goat"
    },
    {
        "rangeDate": "Feb 04 1992-Jan 22 1993",
        "element": "Yang Water",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Jan 23 1993-Feb 09 1994",
        "element": "Yin Water",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 10 1994-Jan 30 1995",
        "element": "Yang Wood",
        "animal": "Dog"
    },
    {
        "rangeDate": "Jan 31 1995-Feb 18 1996",
        "element": "Yin Wood",
        "animal": "Pig"
    },
    {
        "rangeDate": "Feb 19 1996-Feb 06 1997",
        "element": "Yang Fire",
        "animal": "Rat"
    },
    {
        "rangeDate": "Feb 07 1997-Jan 27 1998",
        "element": "Yin Fire",
        "animal": "Ox"
    },
    {
        "rangeDate": "Jan 28 1998-Feb 15 1999",
        "element": "Yang Earth",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 16 1999-Feb 04 2000",
        "element": "Yin Earth",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Feb 05 2000-Jan 23 2001",
        "element": "Yang Metal",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Jan 24 2001-Feb 11 2002",
        "element": "Yin Metal",
        "animal": "Snake"
    },
    {
        "rangeDate": "Feb 12 2002-Jan 31 2003",
        "element": "Yang Water",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 01 2003-Jan 21 2004",
        "element": "Yin Water",
        "animal": "Goat"
    },
    {
        "rangeDate": "Jan 22 2004-Feb 08 2005",
        "element": "Yang Wood",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Feb 09 2005-Jan 28 2006",
        "element": "Yin Wood",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Jan 29 2006-Feb 17 2007",
        "element": "Yang Fire",
        "animal": "Dog"
    },
    {
        "rangeDate": "Feb 18 2007-Feb 06 2008",
        "element": "Yin Fire",
        "animal": "Pig"
    },
    {
        "rangeDate": "Feb 07 2008-Jan 25 2009",
        "element": "Yang Earth",
        "animal": "Rat"
    },
    {
        "rangeDate": "Jan 26 2009-Feb 13 2010",
        "element": "Yin Earth",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 14 2010-Feb 02 2011",
        "element": "Yang Metal",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 03 2011-Jan 22 2012",
        "element": "Yin Metal",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Jan 23 2012-Feb 09 2013",
        "element": "Yang Water",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 10 2013-Jan 30 2014",
        "element": "Yin Water",
        "animal": "Snake"
    },
    {
        "rangeDate": "Jan 31 2014-Feb 18 2015",
        "element": "Yang Wood",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 19 2015-Feb 07 2016",
        "element": "Yin Wood",
        "animal": "Goat"
    },
    {
        "rangeDate": "Feb 08 2016-Jan 27 2017",
        "element": "Yang Fire",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Jan 28 2017-Feb 15 2018",
        "element": "Yin Fire",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 16 2018-Feb 04 2019",
        "element": "Yang Earth",
        "animal": "Dog"
    },
    {
        "rangeDate": "Feb 05 2019-Jan 24 2020",
        "element": "Yin Earth",
        "animal": "Pig"
    },
    {
        "rangeDate": "Jan 25 2020-Feb 11 2021",
        "element": "Yang Metal",
        "animal": "Rat"
    },
    {
        "rangeDate": "Feb 12 2021-Jan 31 2022",
        "element": "Yin Metal",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 01 2022-Jan 21 2023",
        "element": "Yang Water",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Jan 22 2023-Feb 09 2024",
        "element": "Yin Water",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Feb 10 2024-Jan 28 2025",
        "element": "Yang Wood",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Jan 29 2025-Feb 16 2026",
        "element": "Yin Wood",
        "animal": "Snake"
    },
    {
        "rangeDate": "Feb 17 2026-Feb 05 2027",
        "element": "Yang Fire",
        "animal": "Horse"
    },
    {
        "rangeDate": "Feb 06 2027-Jan 25 2028",
        "element": "Yin Fire",
        "animal": "Goat"
    },
    {
        "rangeDate": "Jan 26 2028-Feb 12 2029",
        "element": "Yang Earth",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Feb 13 2029-Feb 02 2030",
        "element": "Yin Earth",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Feb 03 2030-Jan 22 2031",
        "element": "Yang Metal",
        "animal": "Dog"
    },
    {
        "rangeDate": "Jan 23 2031-Feb 10 2032",
        "element": "Yin Metal",
        "animal": "Pig"
    },
    {
        "rangeDate": "Feb 11 2032-Jan 30 2033",
        "element": "Yang Water",
        "animal": "Rat"
    },
    {
        "rangeDate": "Jan 31 2033-Feb 18 2034",
        "element": "Yin Water",
        "animal": "Ox"
    },
    {
        "rangeDate": "Feb 19 2034-Feb 07 2035",
        "element": "Yang Wood",
        "animal": "Tiger"
    },
    {
        "rangeDate": "Feb 08 2035-Jan 27 2036",
        "element": "Yin Wood",
        "animal": "Rabbit"
    },
    {
        "rangeDate": "Jan 28 2036-Feb 14 2037",
        "element": "Yang Fire",
        "animal": "Dragon"
    },
    {
        "rangeDate": "Feb 15 2037-Feb 03 2038",
        "element": "Yin Fire",
        "animal": "Snake"
    },
    {
        "rangeDate": "Feb 04 2038-Jan 23 2039",
        "element": "Yang Earth",
        "animal": "Horse"
    },
    {
        "rangeDate": "Jan 24 2039-Feb 11 2040",
        "element": "Yin Earth",
        "animal": "Goat"
    },
    {
        "rangeDate": "Feb 12 2040-Jan 31 2041",
        "element": "Yang Metal",
        "animal": "Monkey"
    },
    {
        "rangeDate": "Feb 01 2041-Jan 21 2042",
        "element": "Yin Metal",
        "animal": "Rooster"
    },
    {
        "rangeDate": "Jan 22 2042-Feb 09 2043",
        "element": "Yang Water",
        "animal": "Dog"
    },
    {
        "rangeDate": "Feb 10 2043-Jan 29 2044",
        "element": "Yin Water",
        "animal": "Pig"
    }
].map(d => ({
    ...d, rangeDate: d.rangeDate.split("-")
        .map(d => stringToDate(d, "MMM DD YYYY"))
}))