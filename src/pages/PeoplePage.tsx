import { useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { getPeople } from '../api';
import { Person } from '../types';
import { PersonLink } from '../components/PersonLink';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');

  const findSlug = (list: Person[], name: string) => {
    const person = list.find(pers => pers.name === name);

    return person ? person.slug : null;
  };

  const handleRowClick = (slug: string) => {
    setSelectedSlug(slug);
  };

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const peopleFromServer = await getPeople();

        setPeople(peopleFromServer);
      } catch (error) {
        setErrorMessage('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="box table-container">
        {loading ? (
          <Loader />
        ) : (
          <div className="block">
            {errorMessage && (
              <p data-cy="peopleLoadingError" className="has-text-danger">
                {errorMessage}
              </p>
            )}

            {errorMessage.length === 0 && people.length === 0 && (
              <p data-cy="noPeopleMessage">There are no people on the server</p>
            )}
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => (
                  <tr
                    data-cy="person"
                    key={person.slug}
                    className={
                      selectedSlug === person.slug
                        ? 'has-background-warning'
                        : ''
                    }
                  >
                    <td>
                      <PersonLink
                        name={person.name}
                        sex={person.sex}
                        slug={findSlug(people, person.name)}
                        onClick={handleRowClick}
                      />
                    </td>

                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>
                      {person.motherName ? (
                        <PersonLink
                          name={person.motherName}
                          sex={'f'}
                          slug={findSlug(people, person.motherName)}
                          onClick={handleRowClick}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {person.fatherName ? (
                        <PersonLink
                          name={person.fatherName}
                          sex={'m'}
                          slug={findSlug(people, person.fatherName)}
                          onClick={handleRowClick}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
