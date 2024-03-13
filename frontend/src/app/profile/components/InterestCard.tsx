import Link from 'next/link';

import EditIcon from '@/assets/edit-2.svg';
import Card, { CardBody, CardHeader } from '@/components/Card';
import Tag from '@/components/Tag';
import { useGlobalContext } from '@/contexts/global.provider';

function InterestCard() {
  const { profile } = useGlobalContext();
  const isEmptyInterest = () => {
    return (profile?.interests || [])?.length === 0;
  };
  return (
    <Card className="bg-dark">
      <CardHeader
        actionComponent={
          <Link href={"/interest"}>
            <EditIcon />
          </Link>
        }
      >
        <h1 className="text-sm">Interest</h1>
      </CardHeader>
      <CardBody className="flex text-sm flex-row justify-start flex-wrap gap-2 items-center px-2 py-2 mt-4">
        {isEmptyInterest() && (
          <span>Add in your interest to find a better match</span>
        )}
        {(profile?.interests || [])?.map((interest, index) => (
          <Tag key={`${interest}-${index}`} label={interest} />
        ))}
      </CardBody>
    </Card>
  );
}
export default InterestCard;
