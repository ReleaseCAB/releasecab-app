import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Select,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Pagination } from "@components/paginiation";
import {
  AddNewReleaseComment,
  DeleteReleaseComment,
  FetchNextStageConnections,
  GetReleaseComments,
  UpdateRelease,
} from "@services/ReleaseApi";
import { GetUserProfile } from "@services/UserApi";
import { ConvertTimeToLocale } from "@utils/TimeConverter";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiX } from "react-icons/bi";

export const ViewRelease = ({ release }) => {
  const commentsRef = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const releaseIdentifier = router.query.release;
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [profile, setProfile] = useState({});
  const [
    nextStageConnectionsWithApprover,
    setNextStageConnectionsWithApprover,
  ] = useState([]);
  const [
    nextStageConnectionsWithoutApprover,
    setNextStageConnectionsWithoutApprover,
  ] = useState([]);

  const getUserData = async () => {
    const userProfileResponse = await GetUserProfile();
    if (userProfileResponse.ok) {
      const userProfile = await userProfileResponse.json();
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    fetchNextStageConnections();
    getUserData();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchNextStageConnections = async () => {
    const response = await FetchNextStageConnections(
      release.current_stage_id,
      release.id,
    );
    if (response.ok) {
      const data = await response.json();
      setNextStageConnectionsWithApprover(data.to_stages_with_approver);
      setNextStageConnectionsWithoutApprover(data.to_stages_without_approver);
    } else {
      router.push("/");
    }
  };

  const fetchComments = async () => {
    const commentResponse = await GetReleaseComments(releaseIdentifier, page);
    if (commentResponse.ok) {
      const commentData = await commentResponse.json();
      setComments(commentData);
    }
  };

  const deleteComment = async (id) => {
    const deleteResult = await DeleteReleaseComment(id);
    if (deleteResult.ok) {
      toast({
        title: "Comment Deleted",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Deleting Release",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
    fetchComments();
  };

  const setNewRelease = async (newStageId) => {
    if (newStageId !== release.current_stage_id) {
      setLoading(true);
      const updatedRelease = {
        current_stage: newStageId,
      };
      const response = await UpdateRelease(updatedRelease, release.id);
      if (response.ok) {
        router.reload();
      } else {
        toast({
          title: "Error Updating Release",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
      setLoading(false);
    }
  };

  const approveStep = async () => {
    setLoading(true);
    const updatedRelease = {
      current_stage: release.next_stage,
    };
    const response = await UpdateRelease(updatedRelease, release.id);
    if (response.ok) {
      router.reload();
    } else {
      toast({
        title: "Error Updating Release",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const commentBody = {
      comment_body: newComment,
      release: release.id,
    };
    const response = await AddNewReleaseComment(commentBody);
    if (response.ok) {
      const data = await response.json();
      setPage(1);
      fetchComments();
      setNewComment("");
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg">{release.name}</Heading>
      {loading && <Spinner></Spinner>}
      {(nextStageConnectionsWithoutApprover.length > 0 ||
        nextStageConnectionsWithApprover.length > 0) &&
        !loading && (
          <>
            <FormControl w="60%" display="flex" justifyContent="end">
              <Select
                w="30%"
                value={release.current_stage_id}
                isDisabled={release.pending_approval}
                onChange={(event) => setNewRelease(event.target.value)}
              >
                <option key="current_stage" value={release.current_stage_id}>
                  {release.current_stage}
                </option>
                {nextStageConnectionsWithApprover.map((stage) => (
                  <option key={stage.name} value={stage.id}>
                    {stage.name} (Requires Approval)
                  </option>
                ))}
                {nextStageConnectionsWithoutApprover.map((stage) => (
                  <option key={stage.name} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {release.pending_approval && (
              <Flex justifyContent="end" w="60%">
                <Badge colorScheme="orange">
                  Approval Pending: {release.next_stage_name}
                </Badge>
              </Flex>
            )}
            {release.pending_approval &&
              nextStageConnectionsWithoutApprover.some(
                (stage) => stage.name === release.next_stage_name,
              ) && (
                <Flex justifyContent="end" w="60%" mt={"2"}>
                  <Button
                    bg="brand.button_enabled"
                    color="brand.white_text"
                    size="sm"
                    onClick={() => approveStep()}
                  >
                    Approve
                  </Button>
                </Flex>
              )}
          </>
        )}
      <Grid templateColumns="repeat(2, 20%)" gap={4} mt={4}>
        <GridItem>
          <Badge size="sm">{release.current_stage}</Badge>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <Text fontWeight="bold">Release Type:</Text>
        </GridItem>
        <GridItem>
          {(release.release_type.label && release.release_type.label) !==
            "" && <Badge>{release.release_type.label}</Badge>}
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Release Environment:</Text>
        </GridItem>
        <GridItem>
          {release.release_environment.map((env) => (
            <Badge mr={2} key={env.value}>
              {env.label}
            </Badge>
          ))}
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Affected Teams:</Text>
        </GridItem>
        <GridItem>
          {release.affected_teams.map((team) => (
            <Badge mr={2} key={team.value}>
              {team.label}
            </Badge>
          ))}
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Start Date:</Text>
        </GridItem>
        <GridItem>
          <Text>{ConvertTimeToLocale(release.start_date)}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">End Date:</Text>
        </GridItem>
        <GridItem>
          <Text>{ConvertTimeToLocale(release.end_date)}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Description:</Text>
        </GridItem>
        <GridItem>
          <Text>{release.description || "N/A"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Ticket Link:</Text>
        </GridItem>
        <GridItem>
          <Text>{release.ticket_link || "N/A"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Created By:</Text>
        </GridItem>
        <GridItem>
          <Text>{release.owner_name}</Text>
        </GridItem>
      </Grid>
      <Divider mt={5} mb={5} ref={commentsRef}></Divider>
      <Flex mb={5}>
        <Text as="b">Comments</Text>
      </Flex>
      {comments &&
        comments.results &&
        comments.results.map((comment, index) => (
          <Box key={index}>
            <Text mt={2} mb={2}>
              {comment.writer_name} added a comment at{" "}
              {ConvertTimeToLocale(comment.created_at)}:
              {profile.id === comment.writer && (
                <Tooltip label="Delete Comment">
                  <Button
                    ml={"20%"}
                    size="xs"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <BiX />
                  </Button>
                </Tooltip>
              )}
            </Text>
            <Text ml={2} mb={2}>
              {comment.comment_body}
            </Text>
            <Divider mb={3}></Divider>
          </Box>
        ))}
      {comments && comments.count > 20 && (
        <Center>
          <Box bg="bg.surface" width={"30%"}>
            <Pagination
              count={comments.count}
              pageSize={pageSize}
              siblingCount={2}
              page={page}
              setPage={setPage}
              onChange={(e) => setPage(e.page)}
            />
          </Box>
        </Center>
      )}
      <form onSubmit={handleFormSubmit}>
        <FormControl isRequired position="relative">
          <FormLabel>Add New Comment</FormLabel>
          <Flex direction="column" w={"50%"} position="relative">
            <Textarea
              placeholder="Enter comment"
              required
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              zIndex="1"
            />
            <Button
              type="submit"
              bg="brand.button_enabled"
              color="brand.white_text"
              mt="10px"
              position="absolute"
              bottom="2"
              right="2"
              zIndex="2"
            >
              Save
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Box>
  );
};
