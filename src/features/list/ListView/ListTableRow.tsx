import { MinusIcon } from '@chakra-ui/icons';
import {
    Avatar,
    AvatarGroup,
    HStack,
    LinkBox,
    LinkOverlay,
    Progress,
    Tag,
    Td,
    Text,
    Tr,
    useColorModeValue
} from '@chakra-ui/react';
import { isNumber, round } from 'lodash';
import { useAppDispatch } from '../../../hooks/redux';
import useAuth from '../../../hooks/useAuth';
import { IList, IUser } from '../../../types';
import { formatDate } from '../../../utils/dayjs';
import { ModalTypes, showModal } from '../../modal/modalSlice';

export default function ListTableRow({ list }: { list: IList }) {
    const auth = useAuth() as IUser;
    const dispatch = useAppDispatch();
    let progress = null;

    if (list.items.length > 0) {
        const completeItems = list.items.filter((i) => i.status).length;
        progress = round((completeItems / list.items.length) * 100, 0);
    }

    return (
        <LinkBox
            as={Tr}
            _hover={{
                background: useColorModeValue('blackAlpha.300', 'whiteAlpha.300'),
                cursor: 'pointer'
            }}
        >
            <Td>
                <LinkOverlay
                    onClick={() =>
                        dispatch(showModal({ type: ModalTypes.LIST_VIEW, meta: { list_id: list.id }, size: '3xl' }))
                    }
                >
                    {list.title}
                </LinkOverlay>
            </Td>
            <Td>{list.items.length}</Td>
            <Td>
                {isNumber(progress) ? (
                    <HStack>
                        <Progress hasStripe value={progress} width='80%' />
                        <Text>{progress}%</Text>
                    </HStack>
                ) : (
                    <Text fontSize='sm'>-</Text>
                )}
            </Td>
            <Td>
                <HStack>
                    <AvatarGroup size='sm' spacing={-1} max={2}>
                        {list.members.length > 0 ? (
                            list.members.map((m) => (
                                <Avatar key={m.user.id} name={`${m.user.first_name} ${m.user.last_name}`} />
                            ))
                        ) : (
                            <Avatar icon={<MinusIcon />} />
                        )}
                    </AvatarGroup>
                    {list.user.id === auth.id ? (
                        <Tag colorScheme='blue' variant='subtle' size='sm'>
                            Owner
                        </Tag>
                    ) : null}
                </HStack>
            </Td>
            <Td>{formatDate(list.created_at)}</Td>
            {list.is_complete ? <Td>{formatDate(list.updated_at)}</Td> : null}
        </LinkBox>
    );
}
